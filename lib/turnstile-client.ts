export type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "dark";
  size: "normal" | "compact";
  "response-field-name": string;
  "refresh-expired": "auto";
  retry: "never";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
  "timeout-callback": () => void;
  "unsupported-callback": () => void;
};

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId: string) => string | undefined;
  isExpired: (widgetId: string) => boolean;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "basenote-turnstile-script";
let scriptPromise: Promise<TurnstileApi> | undefined;

// Shared across forms and route changes. Failed loads can be retried explicitly.
export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  const promise = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.removeEventListener("load", loaded);
      script.removeEventListener("error", failed);
    };
    const failed = () => {
      cleanup();
      script.remove();
      reject(new Error("Turnstile could not be loaded."));
    };
    const loaded = () => {
      if (!window.turnstile) return failed();
      cleanup();
      resolve(window.turnstile);
    };
    const timeout = window.setTimeout(failed, 15_000);
    script.addEventListener("load", loaded);
    script.addEventListener("error", failed);
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
  scriptPromise = promise;
  void promise.catch(() => {
    if (scriptPromise === promise) scriptPromise = undefined;
  });
  return promise;
}
