import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import {
  POLIGRAPH_DESCRIPTION,
  POLIGRAPH_OG_IMAGE,
  POLIGRAPH_TAGLINE,
  POLIGRAPH_URL,
  SITE_ORIGIN,
} from "@/lib/site";
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
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `Poligraph — ${POLIGRAPH_TAGLINE}`,
    template: "%s · Poligraph",
  },
  description: POLIGRAPH_DESCRIPTION,
  applicationName: "Poligraph",
  keywords: [
    "Poligraph",
    "worldview",
    "ideology map",
    "political compass",
    "3D ideology",
    "KNIQ",
  ],
  authors: [{ name: "KNIQ · Speedstar AI Labs" }],
  alternates: {
    canonical: POLIGRAPH_URL,
  },
  openGraph: {
    type: "website",
    url: POLIGRAPH_URL,
    siteName: "Poligraph",
    title: `Poligraph — ${POLIGRAPH_TAGLINE}`,
    description: POLIGRAPH_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: POLIGRAPH_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Poligraph — Understand how people think. Fixed 3D worldview atlas.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Poligraph — ${POLIGRAPH_TAGLINE}`,
    description: POLIGRAPH_DESCRIPTION,
    images: [POLIGRAPH_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
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
