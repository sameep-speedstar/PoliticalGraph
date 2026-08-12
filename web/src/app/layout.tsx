import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_NAME } from "@/data/definitions";
import { FOOTER_DISCLAIMER, SHORT_DISCLAIMER } from "@/data/disclaimers";
import { siteBasePath } from "@/lib/site";
import "./globals.css";

const base = siteBasePath();

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — Drop a handle. See the stance.`,
  description:
    "Map Left↔Right and National↔Adversary-Aligned from public X activity. Experimental, evidence-backed — not a personal attack.",
  metadataBase: new URL("https://www.kniq.ai"),
  alternates: { canonical: `${base || ""}/` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div
            className="pointer-events-none absolute inset-0 atmosphere-grid opacity-40"
            aria-hidden
          />
          <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
                {PRODUCT_NAME}
              </span>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
                kniq.ai
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-[var(--muted)]">
              <a
                href="https://www.kniq.ai/"
                className="transition hover:text-[var(--brass)]"
              >
                KNIQ
              </a>
              <Link
                href="/methodology"
                className="transition hover:text-[var(--brass)]"
              >
                Methodology
              </Link>
              <Link href="/#measure" className="transition hover:text-[var(--brass)]">
                Measure
              </Link>
            </nav>
          </header>
          <p className="relative z-10 mx-auto max-w-6xl px-5 text-xs leading-relaxed text-[var(--muted)] sm:px-8">
            {SHORT_DISCLAIMER}{" "}
            <Link href="/methodology" className="text-[var(--brass)] hover:underline">
              Read methodology
            </Link>
            .
          </p>
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl space-y-2 px-5 pb-10 text-xs text-[var(--muted)] sm:px-8">
            <p>{FOOTER_DISCLAIMER}</p>
            <p>
              <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
                Full disclaimers
              </Link>
              {" · "}
              <Link href="/methodology" className="text-[var(--brass)] hover:underline">
                Methodology
              </Link>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
