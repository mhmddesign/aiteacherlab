import { NextRequest, NextResponse } from "next/server";
import { extractClientIp, safeEqualStrings } from "@/lib/auth/crypto";
import {
  cookieOptions,
  PRESENTER_COOKIE,
  signPresenterCookie,
} from "@/lib/auth/session";
import { getFacilitatorPasscode } from "@/lib/env";
import { presenterLoginSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);
    const allowed = await store.checkRateLimit(`presenter_login:${ip}`, 10, 300);
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Veuillez patienter 5 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = presenterLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Identifiant invalide." },
        { status: 400 }
      );
    }

    const expected = getFacilitatorPasscode();
    if (!safeEqualStrings(parsed.data.passcode, expected)) {
      return NextResponse.json(
        { error: "Code animateur incorrect." },
        { status: 401 }
      );
    }

    const workshopId = await store.getWorkshopId();
    const jwt = await signPresenterCookie(workshopId);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(PRESENTER_COOKIE, jwt, cookieOptions());
    return res;
  } catch (err) {
    console.error("[API /presenter/login]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
