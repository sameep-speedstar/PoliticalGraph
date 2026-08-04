import Link from "next/link";

const kniqHome = "https://kniq.ai/";

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="brand-block">
        <a href={kniqHome} className="kniq-crumb" title="Back to KNIQ">
          KNIQ
        </a>
        <span className="crumb-sep" aria-hidden>
          /
        </span>
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">Poligraph</span>
        </Link>
      </div>
      <nav className="nav-links">
        <Link href="/survey">Take the map</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/methodology">Methodology</Link>
      </nav>
    </header>
  );
}
