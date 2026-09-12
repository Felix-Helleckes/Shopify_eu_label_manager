/**
 * Erzeugt die Screenshots der Landingpage (public/img/<lang>/screenshot-*.png).
 *
 * Die Aufnahmen zeigen einen Beispielshop mit den echten Stylesheets und der echten
 * Beschriftung der Theme-App-Blöcke (extensions/eu-compliance-blocks). Jede Szene hat
 * einen eigenen Bildausschnitt: die Kacheln auf der Landingpage sind nur rund 500 px
 * breit, deshalb wird dort eng genug herangegangen, dass der Text lesbar bleibt. Jede
 * Szene ist exakt 16:9 und wird mit hoher Pixeldichte aufgenommen und anschließend auf
 * 1600x900 heruntergerechnet – das gibt scharfe Kanten ohne riesige Dateien.
 *
 *   node scripts/screenshots/build.mjs [de|en]
 *
 * Braucht Google Chrome (headless) und sips, beides auf macOS vorhanden.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const assets = path.join(root, "extensions/eu-compliance-blocks/assets");
const localeDir = path.join(root, "extensions/eu-compliance-blocks/locales");
const outRoot = path.join(root, "public/img");
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "ecs-shots-"));

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_W = 1600;
const OUT_H = 900;

const read = (p) => fs.readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const asset = (file) => `file://${path.join(assets, file)}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Liquids `| t` mit den Platzhaltern, die die Blöcke benutzen. */
function t(dict, key, vars = {}) {
  const [group, name] = key.split(".");
  let s = dict[group][name];
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{{ ${k} }}`, v).replaceAll(`{${k}}`, v);
  }
  return s;
}

const strings = {
  de: json(path.join(localeDir, "de.json")),
  en: json(path.join(localeDir, "en.default.json")),
};

/** Beispielshop – bewusst neutral, damit nichts nach einem echten Händler aussieht. */
const shop = {
  de: {
    htmlLang: "de",
    name: "MUSTERLADEN",
    nav: ["Neuheiten", "Kollektion", "Sale"],
    utility: "Suche · Konto · Warenkorb (2)",
    collection: "Herbstkollektion 2026",
    collectionSub: "Kostenloser Versand ab 49 € · 30 Tage Rückgabe · Gesetzliche Gewährleistung inklusive",
    products: [
      ["Wollmantel Camel", "249,00 €"],
      ["Akku-Bohrschrauber 18 V", "139,00 €"],
      ["Espressomaschine Classic", "599,00 €"],
      ["Laufschuh Trail Pro", "129,00 €"],
    ],
    footer: ["Impressum", "Datenschutz", "Widerrufsbelehrung", "AGB", "Versand"],
    cart: "Warenkorb",
    cartLines: [
      ["Espressomaschine Classic", "599,00 €", "Menge 1"],
      ["Wollmantel Camel", "249,00 €", "Menge 1"],
    ],
    subtotal: "Zwischensumme",
    subtotalValue: "848,00 €",
    checkout: "Zur Kasse · 848,00 €",
    pdpTitle: "Akku-Bohrschrauber 18 V",
    pdpPrice: "139,00 €",
    pdpBuy: "In den Warenkorb",
    pdpShipping: "Lieferung in 2–4 Werktagen",
    producer: "ACME Werkzeuge GmbH",
    model: "AKKU-BS 18 V",
    consumer: "Max Mustermann",
    email: "max.mustermann@example.de",
    order: "#1042",
    orderDate: "3. September 2026",
    goods: "Wollmantel Camel, Größe 50",
    receipt: "WR-20260903-K4TQ7M",
    receivedAt: "3. September 2026, 14:07 Uhr",
  },
  en: {
    htmlLang: "en",
    name: "SAMPLE STORE",
    nav: ["New in", "Collection", "Sale"],
    utility: "Search · Account · Cart (2)",
    collection: "Autumn collection 2026",
    collectionSub: "Free shipping from €49 · 30-day returns · Legal guarantee included",
    products: [
      ["Wool coat camel", "€249.00"],
      ["Cordless drill 18 V", "€139.00"],
      ["Espresso machine Classic", "€599.00"],
      ["Trail running shoe Pro", "€129.00"],
    ],
    footer: ["Imprint", "Privacy", "Withdrawal policy", "Terms", "Shipping"],
    cart: "Cart",
    cartLines: [
      ["Espresso machine Classic", "€599.00", "Quantity 1"],
      ["Wool coat camel", "€249.00", "Quantity 1"],
    ],
    subtotal: "Subtotal",
    subtotalValue: "€848.00",
    checkout: "Checkout · €848.00",
    pdpTitle: "Cordless drill 18 V",
    pdpPrice: "€139.00",
    pdpBuy: "Add to cart",
    pdpShipping: "Delivered in 2–4 working days",
    producer: "ACME Tools Ltd",
    model: "DRILL-BS 18 V",
    consumer: "Alex Morgan",
    email: "alex.morgan@example.com",
    order: "#1042",
    orderDate: "3 September 2026",
    goods: "Wool coat camel, size 50",
    receipt: "WR-20260903-K4TQ7M",
    receivedAt: "3 September 2026, 14:07",
  },
};

/* ------------------------------------------------------------------ Shop-Rahmen */

const SHELL_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    color:#1a1a1a;background:#fff;line-height:1.55;-webkit-font-smoothing:antialiased}
  .sf{display:flex;flex-direction:column;min-height:100vh}
  .sf__head{display:flex;align-items:center;justify-content:space-between;gap:20px;
    padding:14px 28px;border-bottom:1px solid #e6e6e6;background:#fff;flex:none}
  .sf__brand{font-weight:800;letter-spacing:.1em;font-size:15px}
  .sf__nav{display:flex;gap:20px;font-size:14px;color:#6b7280;margin-left:14px}
  .sf__utility{font-size:14px;font-weight:600;color:#374151;white-space:nowrap}
  .sf__body{flex:1;padding:28px;min-height:0;display:flex;flex-direction:column;justify-content:center}
  .sf__body > *{width:100%}
  .sf__foot{flex:none;display:flex;gap:22px;padding:14px 28px;border-top:1px solid #e6e6e6;
    font-size:13px;color:#6b7280}
  h1.sf__title{font-size:34px;line-height:1.15;letter-spacing:-.02em;margin:0 0 6px}
  .sf__sub{color:#4b5563;font-size:14px;margin:0 0 22px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .tile{border:1px solid #e6e6e6;border-radius:10px;overflow:hidden;background:#fff}
  .tile__img{aspect-ratio:1/1;background:linear-gradient(135deg,#eef1f6,#dfe5ee)}
  .tile__body{padding:10px 12px}
  .tile__name{font-size:13.5px;font-weight:600;margin:0}
  .tile__price{font-size:13.5px;color:#4b5563;margin:2px 0 0}
  /* Dialog: im Shop öffnet ihn <dialog>.showModal(), hier wird die gleiche Optik
     ohne Top-Layer nachgestellt, damit Chrome sie aufnehmen kann. */
  .mock-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45)}
  .eu-wd__dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
    max-height:calc(100vh - 40px);overflow:auto}
  .eu-wd__dialog::-webkit-scrollbar{display:none}
  /* Produktseite */
  .pdp{display:grid;grid-template-columns:230px minmax(0,1fr) 300px;gap:26px;align-items:center}
  .pdp__media{aspect-ratio:1/1;border-radius:12px;background:linear-gradient(135deg,#eef1f6,#dfe5ee)}
  .pdp .eu-garan{margin:0}
  .pdp__title{font-size:27px;letter-spacing:-.02em;margin:0 0 4px}
  .pdp__price{font-size:19px;color:#111;margin:0 0 14px}
  .pdp__buy{font:inherit;font-weight:600;font-size:15px;border:0;border-radius:8px;
    background:#111;color:#fff;padding:11px 22px;cursor:pointer}
  .pdp__ship{font-size:13px;color:#6b7280;margin:10px 0 0}
  /* Warenkorb */
  .cart{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:center}
  .cart__sum{display:flex;justify-content:space-between;font-size:14px;font-weight:600;
    border-top:1px solid #e6e6e6;margin-top:14px;padding-top:12px}
  .cart__title{font-size:27px;letter-spacing:-.02em;margin:0 0 16px}
  .line{display:flex;justify-content:space-between;gap:16px;border:1px solid #e6e6e6;
    border-radius:10px;padding:12px 14px;margin-bottom:10px}
  .line__name{font-size:14px;font-weight:600;margin:0}
  .line__meta{font-size:13px;color:#6b7280;margin:2px 0 0}
  .line__price{font-size:14px;font-weight:600;white-space:nowrap}
  .cart__checkout{font:inherit;font-weight:600;font-size:15px;border:0;border-radius:8px;
    background:#111;color:#fff;padding:12px 24px;margin-top:6px;cursor:pointer}
  .cart__aside{width:var(--aside,320px)}
  .cart__aside .eu-guarantee-notice{margin:0}
`;

function page(lang, { css = "", body, stylesheets = ["withdrawal.css", "guarantee.css"] }) {
  return `<!doctype html>
<html lang="${shop[lang].htmlLang}">
<head><meta charset="utf-8">
${stylesheets.map((s) => `<link rel="stylesheet" href="${asset(s)}">`).join("\n")}
<style>${SHELL_CSS}${css}</style>
</head>
<body>${body}</body>
</html>`;
}

function shell(lang, { main, foot = true, extra = "" }) {
  const s = shop[lang];
  return `<div class="sf">
  <div class="sf__head">
    <div style="display:flex;align-items:center">
      <span class="sf__brand">${esc(s.name)}</span>
      <nav class="sf__nav">${s.nav.map((n) => `<span>${esc(n)}</span>`).join("")}</nav>
    </div>
    <div class="sf__utility">${esc(s.utility)}</div>
  </div>
  <div class="sf__body">${main}</div>
  ${foot ? `<div class="sf__foot">${s.footer.map((f) => `<span>${esc(f)}</span>`).join("")}</div>` : ""}
</div>${extra}`;
}

function collection(lang) {
  const s = shop[lang];
  return `<h1 class="sf__title">${esc(s.collection)}</h1>
  <p class="sf__sub">${esc(s.collectionSub)}</p>
  <div class="grid">${s.products
    .map(
      ([name, price]) => `<div class="tile"><div class="tile__img"></div>
      <div class="tile__body"><p class="tile__name">${esc(name)}</p><p class="tile__price">${esc(price)}</p></div></div>`,
    )
    .join("")}</div>`;
}

/* ------------------------------------------------------- Blöcke der App (echte Klassen) */

function dialogForm(lang) {
  const d = strings[lang];
  const field = (label, { help = "", textarea = false, required = false } = {}) => `
    <label class="eu-wd__field">
      <span class="eu-wd__label">${esc(label)}${required ? " *" : ""}</span>
      ${textarea ? '<textarea rows="3"></textarea>' : '<input type="text">'}
      ${help ? `<span class="eu-wd__help">${esc(help)}</span>` : ""}
    </label>`;
  return `<div class="mock-backdrop"></div>
  <div class="eu-wd__dialog">
    <div class="eu-wd__close-form"><button class="eu-wd__close">&times;</button></div>
    <div class="eu-wd__step">
      <h2 class="eu-wd__title">${esc(t(d, "withdrawal.dialog_title"))}</h2>
      <p class="eu-wd__intro">${esc(t(d, "withdrawal.intro"))}</p>
      ${field(t(d, "withdrawal.name"), { required: true })}
      ${field(t(d, "withdrawal.contract"), { required: true, help: t(d, "withdrawal.contract_help") })}
      ${field(t(d, "withdrawal.email"), { required: true })}
      ${field(t(d, "withdrawal.order_date"))}
      ${field(t(d, "withdrawal.details"), { textarea: true })}
      <p class="eu-wd__privacy">${esc(t(d, "withdrawal.privacy"))}</p>
      <div class="eu-wd__actions">
        <button class="eu-wd__btn eu-wd__btn--primary">${esc(t(d, "withdrawal.next"))}</button>
      </div>
    </div>
  </div>`;
}

function dialogReview(lang) {
  const d = strings[lang];
  const s = shop[lang];
  const rows = [
    [t(d, "withdrawal.name"), s.consumer],
    [t(d, "withdrawal.contract"), s.order],
    [t(d, "withdrawal.email"), s.email],
    [t(d, "withdrawal.order_date"), s.orderDate],
    [t(d, "withdrawal.details"), s.goods],
  ];
  return `<div class="mock-backdrop"></div>
  <div class="eu-wd__dialog">
    <div class="eu-wd__close-form"><button class="eu-wd__close">&times;</button></div>
    <div class="eu-wd__step">
      <h2 class="eu-wd__title">${esc(t(d, "withdrawal.review_title"))}</h2>
      <p class="eu-wd__intro">${esc(t(d, "withdrawal.review_intro", { confirm: t(d, "withdrawal.confirm_button") }))}</p>
      <dl class="eu-wd__summary">
        ${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}
      </dl>
      <div class="eu-wd__actions">
        <button class="eu-wd__btn eu-wd__btn--secondary">${esc(t(d, "withdrawal.back"))}</button>
        <button class="eu-wd__btn eu-wd__btn--confirm">${esc(t(d, "withdrawal.confirm_button"))}</button>
      </div>
    </div>
  </div>`;
}

function dialogSuccess(lang) {
  const d = strings[lang];
  const s = shop[lang];
  const text = t(d, "withdrawal.success_text", { date: s.receivedAt, receipt: s.receipt, email: s.email });
  return `<div class="mock-backdrop"></div>
  <div class="eu-wd__dialog">
    <div class="eu-wd__close-form"><button class="eu-wd__close">&times;</button></div>
    <div class="eu-wd__step">
      <h2 class="eu-wd__title">${esc(t(d, "withdrawal.success_title"))}</h2>
      <p class="eu-wd__success">${esc(text)}</p>
      <dl class="eu-wd__summary eu-wd__summary--receipt">
        <dt>${esc(t(d, "withdrawal.receipt_no"))}</dt><dd>${esc(s.receipt)}</dd>
        <dt>${esc(t(d, "withdrawal.submitted_at"))}</dt><dd>${esc(s.receivedAt)}</dd>
      </dl>
      <div class="eu-wd__actions">
        <button class="eu-wd__btn eu-wd__btn--secondary">${esc(t(d, "withdrawal.print"))}</button>
        <button class="eu-wd__btn eu-wd__btn--primary">${esc(t(d, "withdrawal.close"))}</button>
      </div>
    </div>
  </div>`;
}

/** App-Einbettung: fester Button unten links, wie im Shop. */
function embedButton(lang) {
  const d = strings[lang];
  return `<div class="eu-wd-embed eu-wd-embed--bottom-left">
    <button class="eu-wd-trigger eu-wd-trigger--embed">
      <span class="eu-wd-trigger__icon">⤺</span>${esc(t(d, "withdrawal.button"))}
    </button>
  </div>`;
}

function garanLabel(lang, width) {
  const s = shop[lang];
  const years = 5;
  return `<div class="eu-garan eu-garan--nested" style="--eu-garan-width:${width}px">
    <button class="eu-garan__strip">
      <img src="${asset("garan-label-nested.jpg")}" alt="" width="1030" height="162">
      <span class="eu-garan__strip-years">${years}</span>
    </button>
    <div class="eu-garan__full">
      <img class="eu-garan__bg" src="${asset("garan-label.jpg")}" alt="" width="741" height="780">
      <span class="eu-garan__producer">${esc(s.producer)}</span>
      <span class="eu-garan__model">${esc(s.model)}</span>
      <span class="eu-garan__years">${years}</span>
      <span class="eu-garan__qr"></span>
    </div>
  </div>`;
}

function guaranteeNotice(lang, maxWidth) {
  const d = strings[lang];
  return `<div class="eu-guarantee-notice" style="--eu-notice-max:${maxWidth}px">
    <img class="eu-guarantee-notice__img" src="${asset(`legal-guarantee-notice-${lang}.jpg`)}"
      alt="${esc(t(d, "guarantee.notice_alt"))}" width="1100" height="1500">
  </div>`;
}

/* ------------------------------------------------------------------------- Szenen */

const scenes = {
  /* Hero: ganze Shop-Seite, wird auf der Landingpage über die volle Breite gezeigt. */
  "screenshot-form": (lang) => ({
    width: 1600,
    height: 900,
    scale: 2,
    html: page(lang, { body: shell(lang, { main: collection(lang), extra: embedButton(lang) + dialogForm(lang) }) }),
  }),

  /* Kacheln: eng am Dialog, damit der Text in der halben Spaltenbreite lesbar bleibt. */
  "screenshot-review": (lang) => ({
    width: 1024,
    height: 576,
    scale: 3,
    html: page(lang, { body: shell(lang, { main: collection(lang), foot: false, extra: dialogReview(lang) }) }),
  }),

  "screenshot-success": (lang) => ({
    width: 1024,
    height: 576,
    scale: 3,
    html: page(lang, { body: shell(lang, { main: collection(lang), foot: false, extra: dialogSuccess(lang) }) }),
  }),

  "screenshot-product": (lang) => {
    const s = shop[lang];
    const main = `<div class="pdp">
      <div class="pdp__media"></div>
      <div class="pdp__info">
        <h1 class="pdp__title">${esc(s.pdpTitle)}</h1>
        <p class="pdp__price">${esc(s.pdpPrice)}</p>
        <button class="pdp__buy">${esc(s.pdpBuy)}</button>
        <p class="pdp__ship">${esc(s.pdpShipping)}</p>
      </div>
      ${garanLabel(lang, 300)}
    </div>`;
    return {
      width: 1024,
      height: 576,
      scale: 3,
      html: page(lang, { body: shell(lang, { main, foot: false }) }),
    };
  },

  "screenshot-notice": (lang) => {
    const s = shop[lang];
    const main = `<div class="cart">
      <div>
        <h1 class="cart__title">${esc(s.cart)}</h1>
        ${s.cartLines
          .map(
            ([name, price, qty]) => `<div class="line">
            <div><p class="line__name">${esc(name)}</p><p class="line__meta">${esc(qty)}</p></div>
            <span class="line__price">${esc(price)}</span></div>`,
          )
          .join("")}
        <div class="cart__sum"><span>${esc(s.subtotal)}</span><span>${esc(s.subtotalValue)}</span></div>
        <button class="cart__checkout">${esc(s.checkout)}</button>
      </div>
      <div class="cart__aside" style="--aside:330px">${guaranteeNotice(lang, 330)}</div>
    </div>`;
    return {
      width: 1024,
      height: 576,
      scale: 3,
      html: page(lang, { body: shell(lang, { main, foot: false }) }),
    };
  },

  /* Titelbild (Store-Listing): Shop mit Einbettungs-Button und Gewährleistungshinweis. */
  "screenshot-cover": (lang) => {
    const main = `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:36px;align-items:start">
      <div>${collection(lang)}</div>
      <div style="width:300px">${guaranteeNotice(lang, 300)}</div>
    </div>`;
    return {
      width: 1600,
      height: 900,
      scale: 2,
      html: page(lang, { body: shell(lang, { main, extra: embedButton(lang) }) }),
    };
  },
};

/* ---------------------------------------------------------------------- Aufnahme */

function shoot(lang, name) {
  const scene = scenes[name](lang);
  const htmlFile = path.join(tmp, `${lang}-${name}.html`);
  fs.writeFileSync(htmlFile, scene.html);

  const outDir = path.join(outRoot, lang);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${name}.png`);

  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--default-background-color=ffffff",
      "--virtual-time-budget=4000",
      `--force-device-scale-factor=${scene.scale}`,
      `--window-size=${scene.width},${scene.height}`,
      `--screenshot=${out}`,
      `file://${htmlFile}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );

  // Herunterrechnen auf die Zielgröße – das Übersampling macht den Text scharf.
  execFileSync("sips", ["-z", String(OUT_H), String(OUT_W), out], { stdio: ["ignore", "ignore", "pipe"] });
  const size = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`${lang}/${name}.png  ${scene.width}x${scene.height}@${scene.scale}x  ->  ${OUT_W}x${OUT_H}  ${size} KB`);
}

const langs = process.argv[2] ? [process.argv[2]] : ["de", "en"];
for (const lang of langs) {
  for (const name of Object.keys(scenes)) shoot(lang, name);
}
console.log(`\nZwischendateien: ${tmp}`);
