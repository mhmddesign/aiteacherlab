import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/env";

export const PARTICIPANT_COOKIE = "ai_lab_participant_session";
export const PRESENTER_COOKIE = "ai_lab_presenter_session";

export interface ParticipantSessionClaims {
  role: "participant";
  participantId: string;
  workshopId: string;
  displayName: string;
  tokenHash: string;
}

export interface PresenterSessionClaims {
  role: "presenter";
  workshopId: string;
}

function getSigningKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

export async function signParticipantCookie(
  claims: Omit<ParticipantSessionClaims, "role">
): Promise<string> {
  return new SignJWT({ ...claims, role: "participant" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSigningKey());
}

export async function signPresenterCookie(workshopId: string): Promise<string> {
  return new SignJWT({ role: "presenter", workshopId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSigningKey());
}

export async function verifyParticipantSession(): Promise<ParticipantSessionClaims | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PARTICIPANT_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, getSigningKey());
    if (
      payload.role !== "participant" ||
      typeof payload.participantId !== "string" ||
      typeof payload.workshopId !== "string" ||
      typeof payload.displayName !== "string" ||
      typeof payload.tokenHash !== "string"
    ) {
      return null;
    }
    return {
      role: "participant",
      participantId: payload.participantId,
      workshopId: payload.workshopId,
      displayName: payload.displayName,
      tokenHash: payload.tokenHash,
    };
  } catch {
    return null;
  }
}

export async function verifyPresenterSession(): Promise<PresenterSessionClaims | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PRESENTER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, getSigningKey());
    if (payload.role !== "presenter" || typeof payload.workshopId !== "string") {
      return null;
    }
    return {
      role: "presenter",
      workshopId: payload.workshopId,
    };
  } catch {
    return null;
  }
}

export function cookieOptions(isHttps = false) {
  const secure =
    isHttps ||
    process.env.VERCEL === "1" ||
    Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://"));
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}
