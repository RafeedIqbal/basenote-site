"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Prerendered pages carry the build year; the browser corrects it after hydration.
export default function CurrentYear({ buildYear }: { buildYear: number }) {
  return useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => buildYear);
}
