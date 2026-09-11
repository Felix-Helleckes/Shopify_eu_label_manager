/** Stylesheet for the public landing page. Kept as a string so the route stays a single server-rendered document. */
export const LANDING_CSS = `
:root{
  --eu:#003399; --eu-dark:#00246b; --eu-soft:#eef2fb; --gold:#ffcc00;
  --ink:#101828; --muted:#5b6472; --line:#e3e7ee; --bg:#ffffff; --bg-alt:#f7f9fc;
  --radius:14px; --shadow:0 1px 2px rgba(16,24,40,.05),0 8px 24px rgba(16,24,40,.06);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:var(--eu)}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}

/* header */
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:-.2px;color:var(--ink);text-decoration:none}
.brand .mark{width:32px;height:32px;border-radius:9px;background:var(--eu);color:#fff;display:grid;place-items:center;font-size:17px}
.nav-right{display:flex;align-items:center;gap:18px;font-size:14px}
.nav-right a{color:var(--muted);text-decoration:none}
.nav-right a:hover{color:var(--ink)}

/* hero */
.hero{padding:28px 0 8px}
.kicker{display:inline-flex;align-items:center;gap:8px;background:var(--eu-soft);color:var(--eu-dark);
  font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px}
.kicker .dot{width:7px;height:7px;border-radius:50%;background:var(--eu)}
h1{font-size:clamp(30px,4.6vw,50px);line-height:1.1;letter-spacing:-1.1px;margin:18px 0 16px;max-width:16ch}
.lead{font-size:clamp(16px,1.6vw,19px);color:var(--muted);max-width:60ch;margin:0 0 26px}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.btn{display:inline-block;border:0;border-radius:10px;padding:13px 22px;font-size:16px;font-weight:600;
  text-decoration:none;cursor:pointer;transition:transform .08s ease,background .15s ease}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--eu);color:#fff}
.btn-primary:hover{background:var(--eu-dark)}
.btn-ghost{background:#fff;color:var(--eu);border:1.5px solid var(--line)}
.btn-ghost:hover{border-color:var(--eu)}
.note{font-size:14px;color:var(--muted);margin:14px 0 0}
.hero-shot{margin:36px 0 0;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}

/* deadlines */
.dl{background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:56px;padding:40px 0}
.dl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;margin-top:20px}
.dl-item{border-left:3px solid var(--eu);padding-left:16px}
.dl-date{font-weight:700;font-size:15px;color:var(--eu-dark)}
.dl-item p{margin:6px 0 0;font-size:15px;color:var(--muted)}
.badge-live{display:inline-block;background:#e7f5ec;color:#0d6b35;font-size:12px;font-weight:700;
  padding:2px 8px;border-radius:6px;margin-left:8px;vertical-align:middle}
.badge-soon{display:inline-block;background:#fff4d6;color:#7a5200;font-size:12px;font-weight:700;
  padding:2px 8px;border-radius:6px;margin-left:8px;vertical-align:middle}

section{padding:64px 0}
h2{font-size:clamp(23px,2.6vw,32px);letter-spacing:-.6px;margin:0 0 10px}
.sub{color:var(--muted);margin:0 0 32px;max-width:62ch}

/* feature cards */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}
.card{border:1px solid var(--line);border-radius:var(--radius);padding:24px;background:#fff}
.card h3{margin:0 0 8px;font-size:17px}
.card p{margin:0;color:var(--muted);font-size:15px}
.card .ico{width:38px;height:38px;border-radius:10px;background:var(--eu-soft);color:var(--eu);
  display:grid;place-items:center;font-size:18px;margin-bottom:14px}

/* screenshots */
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
figure{margin:0}
figure img{border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow)}
figcaption{font-size:13.5px;color:var(--muted);margin-top:9px}

/* pricing */
.price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;align-items:start}
.plan{border:1px solid var(--line);border-radius:var(--radius);padding:26px;background:#fff;position:relative}
.plan.best{border-color:var(--eu);box-shadow:0 0 0 3px rgba(0,51,153,.09)}
.plan .tag{position:absolute;top:-11px;left:24px;background:var(--eu);color:#fff;font-size:12px;
  font-weight:700;padding:3px 10px;border-radius:999px}
.plan h3{margin:0;font-size:18px}
.amount{font-size:30px;font-weight:700;letter-spacing:-.8px;margin:10px 0 2px}
.amount small{font-size:14px;font-weight:500;color:var(--muted);letter-spacing:0}
.plan ul{list-style:none;padding:0;margin:18px 0 0}
.plan li{position:relative;padding-left:24px;margin-bottom:9px;font-size:15px;color:var(--muted)}
.plan li::before{content:"";position:absolute;left:0;top:7px;width:13px;height:7px;
  border-left:2px solid var(--eu);border-bottom:2px solid var(--eu);transform:rotate(-45deg)}

/* faq */
.faq{border-top:1px solid var(--line)}
.qa{border-bottom:1px solid var(--line);padding:20px 0}
.qa h3{margin:0 0 6px;font-size:16.5px}
.qa p{margin:0;color:var(--muted);font-size:15px}

/* install */
.install{background:var(--eu);color:#fff;border-radius:var(--radius);padding:34px;margin-top:8px}
.install h2{color:#fff;margin-bottom:6px}
.install p{color:#d6e0f5;margin:0 0 18px}
.install input{width:100%;max-width:380px;padding:12px 14px;font-size:16px;border:0;border-radius:10px;margin:0 0 12px}
.install .btn{background:#fff;color:var(--eu)}
.err{background:#fff2f0;color:#8c1d18;padding:9px 12px;border-radius:8px;font-size:14px;max-width:380px;margin:0 0 12px}

footer{border-top:1px solid var(--line);padding:34px 0 48px;font-size:14px;color:var(--muted)}
footer a{color:var(--muted)}
.foot-links{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px}
@media (max-width:640px){ section{padding:48px 0} .install{padding:24px} }
`;
