import Link from "next/link";

export default function MethodologyPage() {
  return (
    <article className="method-prose">
      <h1>Methodology</h1>
      <p>
        Poligraph is an interpretive atlas. It does not claim objective
        truth about anyone&apos;s soul — it places answers and public records into
        a shared three-dimensional model so similarities are geometric and
        inspectable.
      </p>

      <h2>The three axes</h2>
      <table>
        <thead>
          <tr>
            <th>Axis</th>
            <th>−100</th>
            <th>+100</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Economic</td>
            <td>Equality / redistribution</td>
            <td>Markets / property</td>
          </tr>
          <tr>
            <td>Authority</td>
            <td>Libertarian / civil liberties</td>
            <td>Authoritarian / strong order</td>
          </tr>
          <tr>
            <td>Cultural identity</td>
            <td>Cosmopolitan / secular-plural</td>
            <td>Particularist / traditional-religious</td>
          </tr>
        </tbody>
      </table>

      <h2>How your survey is scored</h2>
      <p>
        Each statement is a 1–5 Likert item mapped to one axis with a weight and
        a direction (some items are reverse-coded). Centered scores (−2…+2) are
        summed, then scaled to −100…+100 using the maximum possible magnitude on
        that axis.
      </p>
      <p>
        Ideal-person admiration is a soft prior only (≤12% blend toward the mean
        of selected figures). Your statement answers remain dominant. We also
        surface a faith tag from religion items without turning it into a fourth
        hard axis.
      </p>

      <h2>How public figures are placed</h2>
      <p>
        MVP placements are hand-scored composites of publicly available signals:
        speeches and platforms, legislative or governing behavior, documented
        funding and organizational ties, and corporate or institutional roles.
        Each dossier lists a short rationale, confidence (high / medium / low),
        and source themes. Positions carry an <code>asOf</code> date because
        living actors drift.
      </p>
      <p>
        Future versions can propose updates from speech corpora and vote
        databases — with human editorial review before publish, especially for
        heads of state.
      </p>

      <h2>Thinking groups</h2>
      <p>
        After scoring, we report your nearest curated archetype centroids
        (Market Libertarian, Progressive Redistributive, National Conservative,
        etc.). The primary label is a navigation aid; the continuous nearest
        neighbors on the graph are the more honest product.
      </p>

      <h2>What this is not</h2>
      <ul>
        <li>Not a moral ranking or &quot;good vs evil&quot; score.</li>
        <li>Not a prediction of your vote.</li>
        <li>Not an endorsement of any figure you land near.</li>
        <li>
          Not covert microtargeting infrastructure. The consumer survey does not
          require an account. Any future research use requires{" "}
          <strong>explicit opt-in</strong> to a separate Insights panel —
          aggregates and message tests, not silent resale of individual dossiers.
        </li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        <Link href="/survey" className="btn btn-primary">
          Take the map
        </Link>{" "}
        <Link href="/explore" className="btn btn-ghost" style={{ marginLeft: "0.5rem" }}>
          Explore figures
        </Link>
      </p>
    </article>
  );
}
