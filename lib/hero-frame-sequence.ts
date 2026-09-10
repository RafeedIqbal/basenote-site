export type HeroFrame = {
  image: ImageBitmap | HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  preview: boolean;
};

type Preview = { image: string; width: number; height: number; columns: number };

/** A small, fully decoded sprite supplies every frame while detail loads nearby. */
export class HeroFrameSequence {
  private readonly controller = new AbortController();
  private readonly blobs = new Map<number, Blob>();
  private readonly decoded = new Map<number, ImageBitmap>();
  private readonly pending = new Set<number>();
  private readonly failed = new Set<number>();
  private atlas: HTMLImageElement | null = null;
  private previewImage: HTMLImageElement | null = null;
  private target = 0;
  private direction = 1;
  private shown = -1;
  private shownFrame: HeroFrame | null = null;
  private started = false;
  private previewSettled = false;
  private disposed = false;

  constructor(
    private readonly basePath: string,
    private readonly count: number,
    private readonly preview: Preview,
    private readonly onFrame: (index: number, frame: HeroFrame) => void,
    private readonly onError: () => void,
  ) {}

  request(index: number) {
    if (this.disposed) return;
    const next = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    if (next !== this.target) this.direction = Math.sign(next - this.target);
    this.target = next;
    this.paint();
    this.pump();
  }

  warm() {
    if (this.started || this.disposed) return;
    this.started = true;
    void this.loadPreview();
  }

  private async loadPreview() {
    try {
      const image = new Image();
      this.previewImage = image;
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = this.preview.image;
      await image.decode();
      if (!this.disposed) this.atlas = image;
    } catch {
      // Individual frames still work if the preview alone is unavailable.
    } finally {
      this.previewSettled = true;
      this.paint();
      this.pump();
    }
  }

  private paint() {
    if (this.disposed) return;
    const image = this.decoded.get(this.target) ?? this.atlas;
    if (!image || (this.shown === this.target && this.shownFrame?.image === image)) return;
    const preview = image === this.atlas;
    this.shown = this.target;
    this.shownFrame = {
      image,
      x: preview ? (this.target % this.preview.columns) * this.preview.width : 0,
      y: preview ? Math.floor(this.target / this.preview.columns) * this.preview.height : 0,
      width: preview ? this.preview.width : image.width,
      height: preview ? this.preview.height : image.height,
      preview,
    };
    this.onFrame(this.target, this.shownFrame);
  }

  private candidates() {
    // Recompute this queue as the user scrolls; a jump never waits behind all
    // 121 downloads. Look ahead in either direction and keep a small back buffer.
    return [this.target, ...[1, 2, 3, 4, -1, -2].map((offset) => this.target + offset * this.direction)]
      .filter((index) => index >= 0 && index < this.count);
  }

  private pump() {
    if (this.disposed || !this.started || !this.previewSettled) return;
    if (!this.atlas && this.failed.has(this.target)) {
      this.onError();
      return;
    }
    for (const index of this.candidates()) {
      if (this.pending.size >= 2) break;
      if (this.decoded.has(index) || this.pending.has(index) || this.failed.has(index)) continue;
      this.pending.add(index);
      void this.loadDetail(index);
    }
  }

  private async loadDetail(index: number) {
    try {
      let blob = this.blobs.get(index);
      if (!blob) {
        const response = await fetch(`${this.basePath}/${String(index).padStart(3, "0")}.webp`, {
          signal: this.controller.signal,
          priority: "low",
        });
        if (!response.ok) throw new Error("Hero frame unavailable");
        blob = await response.blob();
        if (this.disposed) return;
        this.blobs.set(index, blob);
      }
      // A slow response for a frame we've passed must never repaint an old pose.
      if (this.disposed || !this.candidates().includes(index)) return;
      const image = await createImageBitmap(blob);
      if (this.disposed) {
        image.close();
        return;
      }
      this.decoded.set(index, image);
      this.paint();
      this.trim();
    } catch {
      if (!this.disposed) this.failed.add(index);
    } finally {
      this.pending.delete(index);
      this.pump();
    }
  }

  private trim() {
    if (this.decoded.size <= 8) return;
    const keep = new Set(this.candidates());
    const removable = [...this.decoded.keys()]
      .filter((index) => this.decoded.get(index) !== this.shownFrame?.image)
      .sort((a, b) => Number(keep.has(a)) - Number(keep.has(b)) || Math.abs(b - this.target) - Math.abs(a - this.target));
    while (this.decoded.size > 8 && removable.length) {
      const index = removable.shift()!;
      this.decoded.get(index)?.close();
      this.decoded.delete(index);
    }
  }

  dispose() {
    this.disposed = true;
    this.controller.abort();
    this.previewImage?.removeAttribute("src");
    this.previewImage = null;
    this.atlas = null;
    this.decoded.forEach((image) => image.close());
    this.decoded.clear();
    this.blobs.clear();
  }
}
