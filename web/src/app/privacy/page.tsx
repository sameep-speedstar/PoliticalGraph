import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="method-prose">
      <h1>Privacy</h1>
      <p>
        Poligraph is a KNIQ experiment: a public worldview atlas. Product identity
        is <strong>A</strong> — atlas + optional research panel — not a data
        broker.
      </p>

      <h2>What we collect in Stage 1 (this build)</h2>
      <ul>
        <li>
          Survey answers and admiration picks stored in your browser (
          <code>localStorage</code>) so you can retake or see results.
        </li>
        <li>
          Optional shareable results link encodes your coordinates in the URL
          query string (you choose to share it).
        </li>
        <li>
          Optional locale hint from browser language/timezone —{" "}
          <strong>coarse only</strong>, for suggesting a question pack. You
          confirm or override. We do not treat this as your constituency.
        </li>
        <li>
          Optional “research panel interest” flag stored locally until an Insights
          backend exists — no ideology upload yet.
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>No account required to take the map.</li>
        <li>No silent sale of individual ideology profiles.</li>
        <li>No microtargeting dossier export.</li>
        <li>No ranking of religions, ethnicities, or nations as superior.</li>
      </ul>

      <h2>Future Insights panel</h2>
      <p>
        If you opt into a research panel later, you will see a separate consent
        form describing purpose, retention, and withdrawal. Aggregates will use
        k-anonymity thresholds. Parent site privacy also applies:{" "}
        <a href="https://kniq.ai/privacy">kniq.ai/privacy</a>.
      </p>

      <p style={{ marginTop: "2rem" }}>
        <Link href="/survey" className="btn btn-primary">
          Take the map
        </Link>{" "}
        <Link href="/methodology" className="btn btn-ghost" style={{ marginLeft: "0.5rem" }}>
          Methodology
        </Link>
      </p>
    </article>
  );
}
