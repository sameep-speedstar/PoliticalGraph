import type { LocaleId } from "@/data/localePacks";

/**
 * Coarse locale hint without server IP storage.
 * Prefer explicit user confirmation in the survey UI.
 * (Cloudflare CF-IPCountry can be added later via edge when not using static export.)
 */
export function guessLocaleFromBrowser(): {
  label: string;
  suggestedLocale: LocaleId;
} {
  if (typeof navigator === "undefined") {
    return { label: "unknown", suggestedLocale: "global" };
  }

  const lang = (navigator.language || "").toLowerCase();
  const languages = (navigator.languages || [lang]).map((l) => l.toLowerCase());
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    tz = "";
  }

  if (
    languages.some((l) => l.includes("-in") || l.startsWith("hi") || l.startsWith("ta") || l.startsWith("te")) ||
    tz === "Asia/Kolkata" ||
    tz === "Asia/Calcutta"
  ) {
    return { label: "browser/language·IN", suggestedLocale: "IN" };
  }

  if (
    languages.some((l) => l.includes("-us")) ||
    tz.startsWith("America/")
  ) {
    return { label: "browser/language·US", suggestedLocale: "US" };
  }

  if (
    languages.some(
      (l) =>
        l.includes("-gb") ||
        l.includes("-ie") ||
        l.startsWith("fr") ||
        l.startsWith("de") ||
        l.startsWith("nl") ||
        l.startsWith("es") ||
        l.startsWith("it") ||
        l.startsWith("sv") ||
        l.startsWith("pl"),
    ) ||
    tz.startsWith("Europe/")
  ) {
    return { label: "browser/language·EU", suggestedLocale: "EU" };
  }

  return { label: "browser·global", suggestedLocale: "global" };
}
