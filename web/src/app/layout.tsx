import type { Metadata } from "next";
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
  title: "PoliticalGraph — 3D political inclination mapping",
  description:
    "Map your political, cultural, and religious inclinations in 3D space. Compare yourself with public figures from Soros to Modi to Musk.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          PoliticalGraph is an interpretive atlas of ideas — not a moral score,
          endorsement, or prediction market. Public-figure placements use openly
          available signals and carry explicit confidence levels.
        </footer>
      </body>
    </html>
  );
}
