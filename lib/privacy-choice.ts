export const PRIVACY_COOKIE = "bn_privacy";
export const PRIVACY_CHANGE_EVENT = "basenote:privacy";

export function privacyChoice(value?: string | null) {
  const analytics = value === "v1.10" || value === "v1.11";
  const marketing = value === "v1.01" || value === "v1.11";
  return {
    analytics,
    marketing,
    chosen: analytics || marketing || value === "v1.00",
  };
}
