import { NextResponse } from "next/server";
import type { LocaleId } from "@/data/localePacks";

/**
 * Coarse country hint only — never used as precise political geography.
 * On Cloudflare, CF-IPCountry is available. Users must confirm/override in UI.
 */
export async function GET(request: Request) {
  const h = request.headers;
  const cf = (h.get("cf-ipcountry") || h.get("CF-IPCountry") || "")
    .toUpperCase()
    .trim();
  const vercel = (h.get("x-vercel-ip-country") || "").toUpperCase().trim();
  const country = cf && cf !== "XX" ? cf : vercel || null;

  let suggestedLocale: LocaleId = "global";
  if (country === "IN") suggestedLocale = "IN";
  else if (country === "US") suggestedLocale = "US";
  else if (
    country &&
    ["GB", "IE", "FR", "DE", "NL", "ES", "IT", "PT", "BE", "AT", "SE", "DK", "FI", "PL"].includes(
      country,
    )
  ) {
    suggestedLocale = "EU";
  }

  return NextResponse.json({
    country,
    suggestedLocale,
    precision: "country_only",
    note: "Guess only — user must confirm. Not stored as a voter/residence location.",
  });
}
