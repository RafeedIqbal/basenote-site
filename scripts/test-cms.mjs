import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const origin = process.env.CMS_TEST_ORIGIN || "http://127.0.0.1:4317";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) throw new Error("Run the publishing exercise against a local server with an isolated database.");
const email = process.env.CMS_BOOTSTRAP_EMAIL, password = process.env.CMS_BOOTSTRAP_PASSWORD;
if (!email || !password) throw new Error("Supply the test admin credentials.");
const request = (path, options) => fetch(new URL(path, origin), options);
const login = await request("/api/admins/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
assert.equal(login.status, 200, "admin login");
const cookie = login.headers.getSetCookie().map(c => c.split(";")[0]).join("; ");
const json = async (path, method = "GET", data) => {
  const res = await request(path, { method, headers: { Cookie: cookie, "Content-Type": "application/json" }, body: data === undefined ? undefined : JSON.stringify(data) });
  const body = await res.json();
  assert.ok(res.ok, path + " " + res.status + " " + JSON.stringify(body.errors || []).slice(0, 400));
  return body;
};
async function publicText(path, phrase, expected) {
  for (let i = 0; i < 8; i++) {
    const response = await request(path);
    const text = await response.text();
    if (text.includes(phrase) === expected) return;
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  assert.fail(path + " public visibility disagrees with expected " + expected);
}
const id = randomUUID();
const title = "CMS publishing check " + id;
const slug = "cms-check-" + id;
const contentPath = "/blogs/" + slug;
const read = await request("/api/admins/runtime", { headers: { Cookie: cookie } });
assert.equal(read.status, 200);
console.log("Authenticated runtime", (await read.json()).node);
assert.equal((await request("/cms/preview?path=/about")).status, 403);
assert.equal((await request("/api/admins")).status, 403);
const library = await json("/api/media?limit=1");
const art = (await json("/api/articles?limit=1&depth=0")).docs[0];
const upload = new FormData();
const pixels = await sharp({ create: { width: 24, height: 16, channels: 3, background: "#9fd0e6" } }).png().toBuffer();
upload.append("file", new Blob([pixels], { type: "image/png" }), slug + ".png");
upload.append("_payload", JSON.stringify({ alt: title }));
const uploaded = await request("/api/media", { method: "POST", headers: { Cookie: cookie }, body: upload });
assert.equal(uploaded.status, 201, "media upload");
const asset = (await uploaded.json()).doc;
const image = await request("/api/media/file/" + encodeURIComponent(asset.filename));
assert.equal(image.status, 200);
assert.equal((await image.arrayBuffer()).byteLength, asset.filesize);
console.log("Uploaded and read image", asset.id, "existing library items", library.totalDocs);

const page = (await json("/api/pages?where[key][equals]=about")).docs[0];
const pageField = "hero.title";
const pageVersions = await json("/api/pages/versions?where[parent][equals]=" + page.id + "&where[version._status][equals]=published&sort=-updatedAt&limit=1");
let articleID;
try {
  const result = await json("/api/pages/" + page.id + "?draft=true", "PATCH", { copy: { ...page.copy, [pageField]: title }, _status: "draft" });
  assert.equal(result.doc.copy[pageField], title);
  await publicText("/about", title, false);
  const anon = await request("/api/pages/" + page.id + "?draft=true");
  assert.ok(!(await anon.text()).includes(title), "signed-out REST requests cannot read draft copy");
  const preview = await request("/cms/preview?path=/about", { headers: { Cookie: cookie }, redirect: "manual" });
  assert.equal(preview.status, 303);
  const bypass = preview.headers.getSetCookie().map(c => c.split(";")[0]).join("; ");
  const previewPage = await request("/about", { headers: { Cookie: cookie + "; " + bypass } });
  assert.ok((await previewPage.text()).includes(title), "private page preview");
  console.log("Page draft private and preview visible to signed-in admin");

  const { doc } = await json("/api/articles?draft=true", "POST", { section: "blogs", slug, title, topic: "Publishing check", description: title, introduction: title, published: new Date().toISOString(), cover: asset.id, sections: [{ heading: "Details", anchor: "details", paragraphs: "First paragraph.\n\nSecond paragraph." }], product: art.product, enquiry: art.enquiry, _status: "draft" });
  articleID = doc.id;
  assert.equal((await request(contentPath)).status, 404);
  await json("/api/articles/" + articleID, "PATCH", { _status: "published" });
  await publicText(contentPath, title, true);
  await publicText("/blogs", title, true);
  await publicText("/sitemap.xml", contentPath, true);
  const versions = await json("/api/articles/versions?where[parent][equals]=" + articleID + "&where[version._status][equals]=published&sort=-updatedAt&limit=1");
  assert.ok(versions.docs[0]);
  await json("/api/articles/" + articleID, "PATCH", { _status: "draft" });
  assert.equal((await request(contentPath)).status, 404);
  await publicText("/blogs", title, false);
  await publicText("/sitemap.xml", contentPath, false);
  await json("/api/articles/versions/" + versions.docs[0].id, "POST", {});
  await publicText(contentPath, title, true);
  console.log("Article published, removed from public routes and sitemap, and restored from history");
} finally {
  if (articleID) await json("/api/articles/" + articleID, "DELETE");
  if (pageVersions.docs[0]) await json("/api/pages/versions/" + pageVersions.docs[0].id, "POST", {});
}
