import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import test, { type TestContext } from "node:test";
import { HeroFrameSequence, type HeroFrame } from "./hero-frame-sequence.js";

function setup(t: TestContext, previewFails = false) {
  const response = (index: number, status: number) => ({
    ok: status === 200,
    blob: async () => ({ text: async () => String(index) }) as Blob,
  }) as Response;
  const originalFetch = globalThis.fetch;
  const originalDecode = globalThis.createImageBitmap;
  const originalImage = globalThis.Image;
  const requests: { index: number; signal?: AbortSignal }[] = [];
  const pending = new Map<number, (response: Response) => void>();
  const bitmaps: { index: number; closed: boolean }[] = [];
  const paints: { position: number; frame: HeroFrame }[] = [];
  let errors = 0;
  let decodeGate: { index: number; release: () => void } | undefined;
  let blockDecode = -2;
  globalThis.Image = class {
    width = 3520;
    height = 1980;
    state = { index: -1, closed: false };
    constructor() { bitmaps.push(this.state); }
    set src(_value: string) { requests.push({ index: -1 }); }
    async decode() { if (previewFails) throw new Error("Preview unavailable"); }
    removeAttribute() { this.state.closed = true; }
  } as unknown as typeof Image;
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url === "/preview.webp") {
      requests.push({ index: -1, signal: init!.signal as AbortSignal });
      return response(-1, previewFails ? 404 : 200);
    }
    const index = Number(url.match(/(\d+)\.webp$/)![1]);
    requests.push({ index, signal: init!.signal as AbortSignal });
    return new Promise<Response>((resolve) => pending.set(index, resolve));
  }) as typeof fetch;
  globalThis.createImageBitmap = (async (blob: Blob) => {
    const index = Number(await blob.text());
    const state = { index, closed: false };
    bitmaps.push(state);
    if (index === blockDecode) await new Promise<void>((release) => { decodeGate = { index, release }; });
    return { width: index < 0 ? 3520 : 1280, height: index < 0 ? 1980 : 720, close: () => { state.closed = true; } };
  }) as typeof createImageBitmap;
  const sequence = new HeroFrameSequence("/desktop", 121, { image: "/preview.webp", width: 320, height: 180, columns: 11 },
    (position, frame) => paints.push({ position, frame }),
    () => { errors++; sequence.dispose(); });
  t.after(() => {
    sequence.dispose();
    globalThis.fetch = originalFetch;
    globalThis.createImageBitmap = originalDecode;
    globalThis.Image = originalImage;
  });
  const respond = (index: number, status = 200) => {
    const resolve = pending.get(index);
    assert.ok(resolve, `No pending request for ${index}`);
    pending.delete(index);
    resolve(response(index, status));
  };
  return { sequence, requests, pending, bitmaps, paints, respond, errors: () => errors,
    blockDecode: (index: number) => { blockDecode = index; },
    releaseDecode: () => { assert.ok(decodeGate); decodeGate.release(); } };
}

test("cold scrolling uses the preview immediately and never repaints a stale response", async (t) => {
  const h = setup(t);
  h.sequence.request(0);
  assert.equal(h.requests.length, 0, "An offscreen hero should not fetch frames");
  h.sequence.warm();
  await setImmediate();
  h.sequence.request(79.25);
  assert.equal(h.paints.at(-1)!.position, 79);
  assert.equal(h.paints.at(-1)!.frame.x, 640);
  assert.equal(h.paints.at(-1)!.frame.preview, true);
  h.respond(0);
  await setImmediate();
  assert.equal(h.paints.at(-1)!.position, 79);
  assert.ok(h.requests.some(({ index }) => index === 79), "The new target takes priority");
  h.sequence.request(19.75);
  assert.equal(h.paints.at(-1)!.position, 20, "Reverse scrubbing is immediate too");
});

test("momentum-sized movements show only source frames and skip unchanged poses", async (t) => {
  const h = setup(t);
  h.sequence.request(40.1);
  h.sequence.warm();
  await setImmediate();
  h.respond(40);
  await setImmediate();
  assert.equal(h.paints.at(-1)!.frame.preview, false, "Detail does not wait for the neighboring pose");
  const source40 = h.paints.at(-1)!.frame.image;
  const paintCount = h.paints.length;
  h.sequence.request(40.12);
  h.sequence.request(40.49);
  h.respond(41);
  await setImmediate();
  assert.equal(h.paints.length, paintCount, "Tiny scroll deltas and adjacent downloads do not repaint");
  h.sequence.request(40.5);
  assert.equal(h.paints.at(-1)!.position, 41);
  assert.notEqual(h.paints.at(-1)!.frame.image, source40);
  h.sequence.request(40.49);
  assert.equal(h.paints.at(-1)!.position, 40);
  assert.equal(h.paints.at(-1)!.frame.image, source40, "Reverse scrolling restores the original bitmap");
  h.sequence.request(-0.6);
  assert.equal(h.paints.at(-1)!.position, 0);
  h.sequence.request(120.8);
  assert.equal(h.paints.at(-1)!.position, 120);
  assert.ok(h.paints.every(({ position }) => Number.isInteger(position)));
});

test("idle loading is bounded to the nearby poses and decoded cache stays small", async (t) => {
  const h = setup(t);
  h.sequence.warm();
  await setImmediate();
  for (const position of [0, 20.5, 70.25]) {
    h.sequence.request(position);
    for (let turn = 0; h.pending.size && turn < 12; turn++) {
      for (const index of [...h.pending.keys()]) h.respond(index);
      await setImmediate();
    }
    assert.equal(h.pending.size, 0);
    assert.ok(h.bitmaps.filter(({ closed }) => !closed).length <= 9, "Eight detail bitmaps plus the preview");
  }
  assert.ok(h.requests.length < 30, "Three poses should not download 121 images");
});

test("detail failures retain preview scrubbing", async (t) => {
  const h = setup(t);
  h.sequence.warm();
  await setImmediate();
  h.respond(0, 404);
  await setImmediate();
  h.sequence.request(100.3);
  assert.equal(h.errors(), 0);
  assert.equal(h.paints.at(-1)!.position, 100);
  assert.equal(h.paints.at(-1)!.frame.preview, true);
});

test("missing preview and required frame trigger the static fallback", async (t) => {
  const h = setup(t, true);
  h.sequence.warm();
  await setImmediate();
  h.respond(0, 404);
  await setImmediate();
  assert.equal(h.errors(), 1);
});

test("teardown aborts requests and closes a bitmap that finishes decoding late", async (t) => {
  const h = setup(t);
  h.blockDecode(0);
  h.sequence.warm();
  await setImmediate();
  h.respond(0);
  await setImmediate();
  const paintCount = h.paints.length;
  h.sequence.dispose();
  h.releaseDecode();
  await setImmediate();
  assert.ok(h.requests.every(({ signal }) => !signal || signal.aborted));
  assert.ok(h.bitmaps.every(({ closed }) => closed));
  assert.equal(h.paints.length, paintCount);
});
