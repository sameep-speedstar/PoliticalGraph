import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "XAxis — X Handle Political Mapping",
  description:
    "Drop an X handle. Map Left↔Right and National↔Anti-National from public activity — with evidence.",
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
                XAxis
              </span>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
                handle map
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-[var(--muted)]">
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
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-5 pb-10 text-xs text-[var(--muted)] sm:px-8">
            Public posts only · India v1 lexicon · Interpretive model, not a court of loyalty
          </footer>
        </div>
      </body>
    </html>
  );
}
