/**
 * POST /api/auth/logout
 * Clears the authToken cookie
 */
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("authToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: -1, // delete
  });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
