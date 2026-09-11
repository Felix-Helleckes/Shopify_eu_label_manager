/**
 * Public proof-of-resolution page for App Store review feedback 134896 (requirement 5.1.2).
 * Linked from the Partner Dashboard; kept until the submission is approved.
 */
import { operator } from "../lib/operator";

const EXT = "https://cdn.shopify.com/extensions/01a090e9-baef-70a0-8c9e-ee3fe5fe5228/eu-compliance-suite-11/assets";

const s = {
  main: { fontFamily: "Inter, system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: 32, lineHeight: 1.6, color: "#1a1a1a" },
  h1: { fontSize: 26, marginBottom: 4 },
  h2: { fontSize: 19, marginTop: 34 },
  small: { color: "#666", fontSize: 14 },
  quote: { borderLeft: "4px solid #003399", background: "#f4f6fb", padding: "12px 16px", margin: "16px 0", fontSize: 15 },
  table: { borderCollapse: "collapse", width: "100%", fontSize: 15, marginTop: 12 },
  th: { textAlign: "left", borderBottom: "2px solid #ddd", padding: "6px 8px" },
  td: { borderBottom: "1px solid #eee", padding: "6px 8px", verticalAlign: "top" },
  code: { background: "#f2f2f2", padding: "1px 5px", borderRadius: 3, fontSize: 13 },
  frame: { border: "1px solid #ddd", borderRadius: 6, padding: 20, marginTop: 12, background: "#fff" },
} as const;

export function meta() {
  return [{ title: "Proof of resolution – EU Compliance Suite (5.1.2)" }, { name: "robots", content: "noindex" }];
}

export default function Proof() {
  return (
    <main style={s.main}>
      <link rel="stylesheet" href={`${EXT}/guarantee.css`} />
      <h1 style={s.h1}>Proof of resolution — requirement 5.1.2</h1>
      <p style={s.small}>EU Compliance Suite · reference 134896 · app version eu-compliance-suite-11 · 11 September 2026</p>

      <h2 style={s.h2}>What was reported</h2>
      <blockquote style={s.quote}>
        “While testing the Cart template, we added and saved the app’s legal-guarantee and right-to-repair blocks, and
        they rendered in the theme editor with the text ‘LEGAL GUARANTEE.’ On the live storefront cart, the app fails to
        display either notice anywhere from the cart through the footer.”
      </blockquote>

      <h2 style={s.h2}>What we changed</h2>
      <p>
        We went through every block and removed each case where the theme editor rendered something that the storefront
        does not render. There were four:
      </p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Block</th>
            <th style={s.th}>Before</th>
            <th style={s.th}>Now</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={s.td}><code style={s.code}>withdrawal-button</code></td>
            <td style={s.td}>Plan note rendered in the theme editor only</td>
            <td style={s.td}>Empty in both on the free plan</td>
          </tr>
          <tr>
            <td style={s.td}><code style={s.code}>withdrawal-embed</code></td>
            <td style={s.td}>Plan note rendered in the theme editor only</td>
            <td style={s.td}>Empty in both on the free plan</td>
          </tr>
          <tr>
            <td style={s.td}><code style={s.code}>durability-label</code></td>
            <td style={s.td}>Placeholder rendered in the theme editor only</td>
            <td style={s.td}>Empty in both without a guarantee of more than two years</td>
          </tr>
          <tr>
            <td style={s.td}><code style={s.code}>legal-guarantee-notice</code></td>
            <td style={s.td}>Collapsible variant auto-opened in the theme editor only</td>
            <td style={s.td}>Identical in both</td>
          </tr>
        </tbody>
      </table>
      <p>
        <code style={s.code}>request.design_mode</code> no longer decides what is rendered anywhere in the extension.
        Why a block can legitimately stay empty is now explained in the block’s settings panel, which is not part of the
        rendered page. The app also reminds merchants, in all ten admin languages, to press Save in the theme editor
        after adding a block.
      </p>

      <h2 style={s.h2}>Verified on a live storefront cart</h2>
      <p>
        We placed <code style={s.code}>repair-info</code> and <code style={s.code}>legal-guarantee-notice</code> into an
        <code style={s.code}>apps</code> section of <code style={s.code}>templates/cart.json</code> on our development
        store and loaded <code style={s.code}>/cart</code> on the storefront — no theme editor, no{" "}
        <code style={s.code}>design_mode</code>. The response contains the section{" "}
        <code style={s.code}>shopify-section-template--16132961730618__apps</code> with both notices, between the cart
        footer and the theme footer.
      </p>
      <p>
        Neither block contains conditional logic: they always output markup, independent of plan, product, template or
        language. Below is that output, rendered here with the very same stylesheet and artwork the storefront loads from{" "}
        <code style={s.code}>cdn.shopify.com/extensions/…/eu-compliance-suite-11/assets</code>.
      </p>

      <div style={s.frame}>
        <div className="eu-repair">
          <div className="eu-repair__text">
            <p>
              Right to repair: if goods are defective within the legal guarantee period, you may choose between repair
              and replacement. If you choose repair, the legal guarantee period is extended once by twelve months
              (Directive (EU) 2024/1799; applies to contracts concluded from 31 July 2026).
            </p>
          </div>
        </div>
        <div className="eu-guarantee-notice" style={{ ["--eu-notice-max" as string]: "560px" }}>
          <a
            href="https://europa.eu/youreurope/guarantees"
            target="_blank"
            rel="noopener"
            className="eu-guarantee-notice__link"
          >
            <img
              className="eu-guarantee-notice__img"
              src={`${EXT}/legal-guarantee-notice-en.jpg`}
              alt="Harmonised notice on the legal guarantee of conformity"
              width={1100}
              height={1500}
            />
          </a>
        </div>
      </div>

      <h2 style={s.h2}>How to reproduce</h2>
      <ol>
        <li>Install EU Compliance Suite (version eu-compliance-suite-11 or later).</li>
        <li>
          Theme editor → Cart template → add an <em>Apps</em> section → add <em>EU right to repair notice</em> and{" "}
          <em>EU legal guarantee notice</em> → <strong>Save</strong>.
        </li>
        <li>
          Open <code style={s.code}>/cart</code> on the storefront. Both notices appear above the footer. They are
          present whether or not the cart contains items.
        </li>
      </ol>
      <p style={s.small}>
        If a notice is still missing on the storefront while it is visible in the theme editor, the section is not in
        the published template — the blocks themselves emit markup unconditionally. In that case please let us know and
        we will fix it the same day.
      </p>

      <p style={s.small}>
        {operator.name} · <a href={`mailto:${operator.supportEmail}`}>{operator.supportEmail}</a>
      </p>
    </main>
  );
}
