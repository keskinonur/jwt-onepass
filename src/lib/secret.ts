// src/lib/secret.ts
import { readFileSync } from "fs";
import { join } from "path";

const SECRET_FILE = join(process.cwd(), ".env.local");

/**
 * Returns the CURRENT secret string.
 * Reads the file on every call so hot-reload works.
 */
export function getCurrentSecret(): string {
  try {
    const content = readFileSync(SECRET_FILE, "utf8");
    const m = content.match(/^JWT_SECRET=(.+)$/m);
    if (!m) throw new Error("No JWT_SECRET in .env.local");
    return m[1].trim();
  } catch {
    // fallback to env var if file missing
    return process.env.JWT_SECRET!;
  }
}

/**
 * Grace-period list of secrets (current + last one).
 * Extend the array if you need longer overlap.
 */
export function getVerificationSecrets(): string[] {
  const current = getCurrentSecret();
  const previous = process.env.JWT_SECRET_OLD || ""; // optional fallback
  return [current, previous].filter(Boolean);
}
