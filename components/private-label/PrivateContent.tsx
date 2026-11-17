"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PrivateLabelContent, PrivateLabelGuideContent } from "@/data/site-content";

type Content = { privateLabel: PrivateLabelContent; guide: PrivateLabelGuideContent };
const Context = createContext<Content | null>(null);
export function PrivateContent({ value, children }: { value: Content; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function usePrivateContent() {
  const content = useContext(Context);
  if (!content) throw new Error("Private label content is unavailable.");
  return content;
}
