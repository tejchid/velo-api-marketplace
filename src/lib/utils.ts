import { randomBytes } from "crypto";

export function generateApiKey() {
  // Generates a 32-character hex string prefixed with 'velo_live_'
  const buffer = randomBytes(16);
  return `velo_live_${buffer.toString("hex")}`;
}