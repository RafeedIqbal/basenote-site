"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

import { loadTurnstile, type TurnstileApi } from "@/lib/turnstile-client";
import { TURNSTILE_ACTION, TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

import styles from "./TurnstileField.module.css";

export type TurnstileHandle = {
  getToken: () => string | null;
  reset: () => void;
};

type TurnstileFieldProps = {
  ref?: Ref<TurnstileHandle>;
  onVerifiedChange: (verified: boolean) => void;
  disabled?: boolean;
};

const messages = {
  loading: "Checking your browser…",
  verified: "Security check complete.",
  error: "The security check could not finish. Please retry.",
  expired: "The security check expired. Please verify again.",
  timeout: "The security check timed out. Please retry.",
};
type Status = keyof typeof messages;

export default function TurnstileField({ ref, onVerifiedChange, disabled = false }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<(TurnstileHandle & { retry: () => void }) | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useImperativeHandle(ref, () => ({
    getToken: () => controllerRef.current?.getToken() ?? null,
    reset: () => controllerRef.current?.reset(),
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    const widget = widgetRef.current;
    if (!siteKey || !container || !widget) return;

    let active = true;
    let api: TurnstileApi | undefined;
    let widgetId: string | undefined;
    let size: "normal" | "compact" | undefined;
    let generation = 0;
    let verified = false;

    const report = (next: Status) => {
      if (!active) return;
      verified = next === "verified";
      onVerifiedChange(verified);
      setStatus(next);
    };
    const remove = () => {
      generation += 1;
      if (widgetId !== undefined) {
        try { api?.remove(widgetId); } catch { /* The provider may already have removed it. */ }
        widgetId = undefined;
      }
    };
    const render = () => {
      if (!active || !api) return;
      const width = container.getBoundingClientRect().width;
      // A closed guide disclosure retains its draft and widget until reopened.
      if (width === 0) return;
      const nextSize = width < 300 ? "compact" : "normal";
      if (widgetId !== undefined && size === nextSize) return;
      remove();
      size = nextSize;
      report("loading");
      const current = generation;
      const update = (next: Status) => {
        if (current === generation) report(next);
      };
      try {
        widgetId = api.render(widget, {
          sitekey: siteKey,
          action: TURNSTILE_ACTION,
          theme: "dark",
          size,
          "response-field-name": TURNSTILE_RESPONSE_FIELD,
          "refresh-expired": "auto",
          retry: "never",
          callback: (token) => update(token ? "verified" : "error"),
          "error-callback": () => update("error"),
          "expired-callback": () => update("expired"),
          "timeout-callback": () => update("timeout"),
          "unsupported-callback": () => update("error"),
        });
        if (widgetId === undefined) report("error");
      } catch {
        report("error");
      }
    };
    const load = () => {
      void loadTurnstile().then((loaded) => {
        if (!active) return;
        api = loaded;
        render();
      }).catch(() => report("error"));
    };
    const reset = () => {
      if (!active) return;
      report("loading");
      if (api && widgetId !== undefined) {
        try { api.reset(widgetId); } catch { remove(); report("error"); }
      } else if (api) {
        render();
      } else {
        load();
      }
    };
    controllerRef.current = {
      reset,
      retry: reset,
      getToken: () => {
        if (!active || !verified || !api || widgetId === undefined) return null;
        try {
          if (api.isExpired(widgetId)) {
            report("expired");
            return null;
          }
          return api.getResponse(widgetId) || null;
        } catch {
          report("error");
          return null;
        }
      },
    };
    const observer = new ResizeObserver(render);
    observer.observe(container);
    load();

    return () => {
      active = false;
      observer.disconnect();
      remove();
      controllerRef.current = null;
    };
  }, [siteKey, onVerifiedChange]);

  return (
    <div ref={containerRef} className={styles.field}>
      <div ref={widgetRef} />
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {siteKey ? messages[status] : "The security check is unavailable. Please try again later."}
      </p>
      {siteKey && status !== "loading" && status !== "verified" ? (
        <button className={styles.retry} type="button" disabled={disabled} onClick={() => controllerRef.current?.retry()}>
          Retry security check
        </button>
      ) : null}
      <noscript>Please enable JavaScript to complete the security check.</noscript>
    </div>
  );
}
