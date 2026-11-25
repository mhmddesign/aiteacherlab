import { NextRequest, NextResponse } from "next/server";
import { extractClientIp, safeEqualStrings } from "@/lib/auth/crypto";
import {
  cookieOptions,
  PRESENTER_COOKIE,
  signPresenterCookie,
} from "@/lib/auth/session";
import { getFacilitatorPasscode, getWorkshopPin } from "@/lib/env";
import { presenterLoginSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);
    const [allowed, body] = await Promise.all([
      store.checkRateLimit(`presenter_login:${ip}`, 10, 300),
      req.json().catch(() => null),
    ]);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Veuillez patienter 5 minutes. / محاولات كثيرة، يرجى الانتظار 5 دقائق.",
        },
        { status: 429 }
      );
    }

    const parsed = presenterLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Identifiant invalide. / معرف غير صالح.",
        },
        { status: 400 }
      );
    }

    const expected = getFacilitatorPasscode();
    if (!safeEqualStrings(parsed.data.passcode, expected)) {
      return NextResponse.json(
        { error: "Code animateur incorrect. / رمز المنشط غير صحيح." },
        { status: 401 }
      );
    }

    const snapshot = await store.getPresenterSnapshot();
    const jwt = await signPresenterCookie(snapshot.state.workshopId);
    const res = NextResponse.json({
      ok: true,
      snapshot: {
        ...snapshot,
        workshopPinHint: getWorkshopPin(),
      },
    });
    res.cookies.set(PRESENTER_COOKIE, jwt, cookieOptions());
    return res;
  } catch (err) {
    console.error("[API /presenter/login]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
