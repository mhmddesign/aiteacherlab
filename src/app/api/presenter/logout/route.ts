import { NextResponse } from "next/server";
import { PRESENTER_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PRESENTER_COOKIE);
  return res;
}
