#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const file = join(process.cwd(), ".env.local");
const env = readFileSync(file, "utf8");

const oldSecret = env.match(/^JWT_SECRET=(.+)$/m)?.[1]?.trim() || "";
const newSecret = randomBytes(32).toString("base64url");

const updated =
  env.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${newSecret}`).replace(/^JWT_SECRET_OLD=.*$/m, `JWT_SECRET_OLD=${oldSecret}`) || // first time
  `${env}\nJWT_SECRET_OLD=${oldSecret}\nJWT_SECRET=${newSecret}\n`;

writeFileSync(file, updated);
console.log(`🔐 Rotated JWT_SECRET → ${newSecret}`);
