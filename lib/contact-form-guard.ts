import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { FORM_HONEYPOT_FIELD } from "@/lib/form-guard-constants";

type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  timestamps: number[];
  windowMs: number;
};

type GuardResult =
  | { ok: true }
  | { ok: false; reason: "spam" }
  | { ok: false; reason: "rate_limit"; error: string };

const RATE_LIMIT_MESSAGE = "Too many requests. Please wait a little and try again.";

const REQUESTER_RATE_LIMIT: RateLimitConfig = {
  limit: 5,
  windowMs: 15 * 60 * 1000
};

const EMAIL_RATE_LIMIT: RateLimitConfig = {
  limit: 3,
  windowMs: 60 * 60 * 1000
};

const rateLimitStore = new Map<string, RateLimitBucket>();

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function cleanupRateLimitStore(now: number) {
  for (const [key, bucket] of rateLimitStore) {
    const recentTimestamps = bucket.timestamps.filter(
      (timestamp) => timestamp > now - bucket.windowMs
    );

    if (recentTimestamps.length === 0) {
      rateLimitStore.delete(key);
      continue;
    }

    if (recentTimestamps.length !== bucket.timestamps.length) {
      rateLimitStore.set(key, {
        timestamps: recentTimestamps,
        windowMs: bucket.windowMs
      });
    }
  }
}

function allowRequest(key: string, config: RateLimitConfig, now: number) {
  const existingBucket = rateLimitStore.get(key);
  const recentTimestamps =
    existingBucket?.timestamps.filter(
      (timestamp) => timestamp > now - config.windowMs
    ) ?? [];

  if (recentTimestamps.length >= config.limit) {
    rateLimitStore.set(key, {
      timestamps: recentTimestamps,
      windowMs: config.windowMs
    });
    return false;
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, {
    timestamps: recentTimestamps,
    windowMs: config.windowMs
  });

  return true;
}

function getRequesterSource(requestHeaders: Headers) {
  const forwardedFor = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return (
    requestHeaders.get("cf-connecting-ip")?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    forwardedFor ||
    requestHeaders.get("user-agent")?.trim() ||
    "unknown"
  );
}

function getNormalizedEmail(email?: string) {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail ? normalizedEmail : undefined;
}

export async function guardPublicSubmission(
  formData: FormData,
  email?: string
): Promise<GuardResult> {
  const honeypotValue = formData.get(FORM_HONEYPOT_FIELD);

  if (typeof honeypotValue === "string" && honeypotValue.trim()) {
    return { ok: false, reason: "spam" };
  }

  const now = Date.now();
  cleanupRateLimitStore(now);

  const requestHeaders = await headers();
  const requesterKey = `contact:requester:${hashValue(
    getRequesterSource(requestHeaders)
  )}`;

  if (!allowRequest(requesterKey, REQUESTER_RATE_LIMIT, now)) {
    return {
      ok: false,
      reason: "rate_limit",
      error: RATE_LIMIT_MESSAGE
    };
  }

  const normalizedEmail = getNormalizedEmail(email);

  if (normalizedEmail) {
    const emailKey = `contact:email:${hashValue(normalizedEmail)}`;

    if (!allowRequest(emailKey, EMAIL_RATE_LIMIT, now)) {
      return {
        ok: false,
        reason: "rate_limit",
        error: RATE_LIMIT_MESSAGE
      };
    }
  }

  return { ok: true };
}
