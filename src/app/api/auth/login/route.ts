/**
 * POST /api/auth/login
 * Accepts { password: string }
 * On success → HttpOnly cookie "authToken" (JWT)
 */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

import { getCurrentSecret } from "@/lib/secret";

const SINGLE_HASH = "$2b$12$HQI4XaFnApOd9yrArcjxse.59l/xPcQNRwGnrixdVl4qfrJpY6xzy";

export async function POST(req: Request) {
  const { password } = await req.json();

  // constant-time comparison to mitigate timing attacks
  const ok = await bcrypt.compare(password, SINGLE_HASH);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign({ sub: "admin" }, getCurrentSecret(), {
    algorithm: "HS256",
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
  });

  const cookie = serialize("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // blocks CSRF on cross-site POST
    maxAge: Number(process.env.JWT_EXPIRES_IN),
    path: "/",
  });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
