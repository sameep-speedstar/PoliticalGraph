import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poligraph — Understand how people think",
  description:
    "Map your worldview in a fixed 3D ideological space. Compare with public figures using evidence-backed profiles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          Poligraph is a KNIQ experiment — a public worldview atlas (product A),
          not a data broker. Public-figure placements require human-approved
          evidence.{" "}
          <a href="https://kniq.ai/">kniq.ai</a>
          {" · "}
          <Link href="/privacy">Privacy</Link>
        </footer>
      </body>
    </html>
  );
}
