export function getSupabaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return url && url.length > 0 && !url.includes("your-project-ref") ? url : null;
}

export function getSupabasePublishableKey(): string | null {
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();
  return key && !key.includes("replace_me") ? key : null;
}

export function getSupabaseSecretKey(): string | null {
  const key = (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  ).trim();
  return key && !key.includes("replace_me") ? key : null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    getSupabaseUrl() && getSupabasePublishableKey() && getSupabaseSecretKey()
  );
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 16 && !secret.includes("replace_with")) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be configured in production.");
  }
  return "dev-mediouna-teacher-workshop-session-secret-2026";
}

export function getWorkshopPin(): string {
  const pin = process.env.WORKSHOP_PIN?.trim();
  if (pin && pin.length >= 4) {
    return pin;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("WORKSHOP_PIN must be configured in production.");
  }
  return "202604";
}

export function getFacilitatorPasscode(): string {
  const pass = process.env.FACILITATOR_PASSCODE?.trim();
  if (pass && pass.length >= 6 && !pass.includes("replace_with")) {
    return pass;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("FACILITATOR_PASSCODE must be configured in production.");
  }
  return "MEDIOUNA-ADMIN-2026";
}

export function getWorkshopSlug(): string {
  return process.env.WORKSHOP_SLUG?.trim() || "mediouna-ai-teacher-lab";
}

export function getPublicAppUrl(fallbackOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return (fallbackOrigin || "http://localhost:3000").replace(/\/$/, "");
}
