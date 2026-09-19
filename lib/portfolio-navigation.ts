const ENTRY_KEY = "basenotePortfolio";
const CHANGE_EVENT = "basenote:portfolio-navigation";

type Navigation = {
  history: Pick<History, "state" | "pushState" | "replaceState" | "back">;
  location: Pick<Location, "pathname" | "search" | "hash">;
  dispatchEvent: (event: Event) => boolean;
};

export function portfolioSlugFromHash(hash: string) {
  if (!hash.startsWith("#")) return "";
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

function pageUrl(location: Navigation["location"]) {
  return location.pathname + location.search;
}

function historyState(history: Navigation["history"]): Record<string, unknown> {
  return history.state && typeof history.state === "object" ? { ...history.state } : {};
}

export function openPortfolioProject(slug: string, navigation: Navigation = window) {
  const { history, location } = navigation;
  if (portfolioSlugFromHash(location.hash) === slug) return;
  const page = pageUrl(location);
  const href = page + "#" + encodeURIComponent(slug);
  history.pushState({
    ...historyState(history),
    [ENTRY_KEY]: { href, returnTo: page + location.hash },
  }, "", href);
  // pushState does not emit hashchange or popstate.
  navigation.dispatchEvent(new Event(CHANGE_EVENT));
}

export function closePortfolioProject(slug: string, navigation: Navigation = window) {
  const { history, location } = navigation;
  // A stale dialog close must not undo a newer hash or route navigation.
  if (portfolioSlugFromHash(location.hash) !== slug) return;
  const page = pageUrl(location);
  const state = historyState(history);
  const entry = state[ENTRY_KEY] as { href?: unknown; returnTo?: unknown } | undefined;
  if (
    entry?.href === page + location.hash &&
    typeof entry.returnTo === "string" &&
    (entry.returnTo === page || entry.returnTo.startsWith(page + "#"))
  ) {
    // Closing a clicked logo consumes its history entry, so Forward reopens it.
    history.back();
    return;
  }
  // A directly shared URL has no local opener: stay on this page when closing.
  delete state[ENTRY_KEY];
  history.replaceState(state, "", page);
  navigation.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToPortfolioHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export const getPortfolioHash = () => window.location.hash;
export const getServerPortfolioHash = () => "";
