import Link from "next/link";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link href="/" className="brand">
        <span className="brand-mark" aria-hidden />
        <span className="brand-name">PoliticalGraph</span>
      </Link>
      <nav className="nav-links">
        <Link href="/survey">Take the map</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/methodology">Methodology</Link>
      </nav>
    </header>
  );
}
