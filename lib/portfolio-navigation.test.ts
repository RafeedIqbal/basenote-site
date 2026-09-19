import assert from "node:assert/strict";
import test from "node:test";
import { closePortfolioProject, openPortfolioProject, portfolioSlugFromHash } from "./portfolio-navigation.js";

function setup(url: string, initialState: unknown = { __NA: true, tree: ["router"] }) {
  const entries = [
    { url: new URL("https://example.com/previous-page"), state: null as unknown },
    { url: new URL(url, "https://basenotesolutions.com"), state: initialState },
  ];
  let index = 1;
  const events: string[] = [];
  const navigation = {
    get location() { return entries[index].url; },
    history: {
      get state() { return entries[index].state; },
      pushState(state: unknown, _unused: string, href?: string | URL | null) {
        entries.splice(index + 1);
        entries.push({ url: new URL(href ?? entries[index].url, entries[index].url), state });
        index++;
      },
      replaceState(state: unknown, _unused: string, href?: string | URL | null) {
        entries[index] = { url: new URL(href ?? entries[index].url, entries[index].url), state };
      },
      back() { if (index > 0) { index--; events.push("popstate"); } },
    },
    dispatchEvent(event: Event) { events.push(event.type); return true; },
  };
  return {
    navigation, events,
    get length() { return entries.length; },
    forward() { if (index < entries.length - 1) { index++; events.push("popstate"); } },
  };
}

test("decodes shared story hashes and tolerates malformed input", () => {
  assert.equal(portfolioSlugFromHash("#firmino"), "firmino");
  assert.equal(portfolioSlugFromHash("#fashion%2Dtv"), "fashion-tv");
  assert.equal(portfolioSlugFromHash("#%E0%A4%A"), "");
  assert.equal(portfolioSlugFromHash(""), "");
  assert.equal(portfolioSlugFromHash("firmino"), "");
});

test("opening pushes a shareable URL once and preserves router state and query", () => {
  const h = setup("/private-label?source=partner#portfolio");
  openPortfolioProject("firmino", h.navigation);
  openPortfolioProject("firmino", h.navigation);
  assert.equal(h.length, 3);
  assert.equal(h.navigation.location.href, "https://basenotesolutions.com/private-label?source=partner#firmino");
  assert.deepEqual(h.navigation.history.state, {
    __NA: true, tree: ["router"],
    basenotePortfolio: {
      href: "/private-label?source=partner#firmino",
      returnTo: "/private-label?source=partner#portfolio",
    },
  });
  assert.deepEqual(h.events, ["basenote:portfolio-navigation"]);
});

test("closing a clicked story returns to its opener and Forward restores the story", () => {
  const h = setup("/private-label?source=partner#portfolio");
  openPortfolioProject("rizla", h.navigation);
  closePortfolioProject("rizla", h.navigation);
  assert.equal(h.navigation.location.hash, "#portfolio");
  assert.equal(h.navigation.location.search, "?source=partner");
  h.forward();
  assert.equal(h.navigation.location.hash, "#rizla");
  closePortfolioProject("rizla", h.navigation);
  assert.equal(h.navigation.location.hash, "#portfolio");
  assert.equal(h.length, 3);
});

test("closing a directly shared URL stays on this page instead of leaving for the referrer", () => {
  const h = setup("/private-label?source=partner#alpac-london");
  closePortfolioProject("alpac-london", h.navigation);
  assert.equal(h.navigation.location.href, "https://basenotesolutions.com/private-label?source=partner");
  assert.equal(h.length, 2);
  assert.deepEqual(h.navigation.history.state, { __NA: true, tree: ["router"] });
  assert.deepEqual(h.events, ["basenote:portfolio-navigation"]);
});

test("a stale close event cannot dismiss a newly selected story or ordinary anchor", () => {
  const h = setup("/private-label");
  openPortfolioProject("firmino", h.navigation);
  openPortfolioProject("fashion-tv", h.navigation);
  closePortfolioProject("firmino", h.navigation);
  assert.equal(h.navigation.location.hash, "#fashion-tv");
  h.navigation.history.pushState(null, "", "#faq");
  closePortfolioProject("fashion-tv", h.navigation);
  assert.equal(h.navigation.location.hash, "#faq");
});

test("a mismatched history marker cannot navigate away when a shared story closes", () => {
  for (const marker of [
    { href: "/private-label#firmino", returnTo: "/another-route" },
    { href: "/private-label?old=query#firmino", returnTo: "/private-label" },
    { href: "/private-label#firmino", returnTo: 1 },
  ]) {
    const h = setup("/private-label#firmino", { __NA: true, basenotePortfolio: marker });
    closePortfolioProject("firmino", h.navigation);
    assert.equal(h.navigation.location.href, "https://basenotesolutions.com/private-label");
    assert.deepEqual(h.navigation.history.state, { __NA: true });
    assert.equal(h.length, 2);
  }
});
