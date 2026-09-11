# Umzug nach Fly.io Frankfurt – erledigt am 11.09.2026

> Status: abgeschlossen. Die App läuft unter https://eu-compliance-suite.fly.dev (Region fra),
> `/healthcheck` meldet `host.region: "fra"`. Netlify bleibt als Rückfallebene bestehen.

Ziel: Die Anwendung läuft in Frankfurt statt in Ohio. Damit stimmt die Aussage „Verarbeitung in der EU“ wieder,
und die Latenz zur Datenbank (Supabase, eu-central-1) sinkt deutlich.

Kosten: eine `shared-cpu-1x`-Maschine mit 512 MB, dauerhaft an, ca. 3,30 USD im Monat. Die Subdomain
`eu-compliance-suite.fly.dev` ist inklusive; eine eigene Domain ist nicht nötig.

## Schritt 1 – Felix (einmalig, ca. 5 Minuten)

Im Terminal, aus dem Home-Verzeichnis (in `~/Documents` schlägt die Shell mit `uv_cwd EPERM` fehl):

```bash
cd ~ && export PATH="$HOME/.fly/bin:$PATH" && fly auth login
```

Der Browser öffnet sich. Dort Konto anlegen (oder anmelden) und unter **Billing** eine Zahlungsmethode hinterlegen.
Ohne Zahlungsmethode lässt Fly keine dauerhaft laufende Maschine zu.

Danach Bescheid geben. Den Rest übernehme ich.

## Schritt 2 – ich

```bash
fly apps create eu-compliance-suite --org personal
./scripts/fly-secrets.sh                # überträgt die Konfiguration von Netlify nach Fly
fly deploy
curl -s https://eu-compliance-suite.fly.dev/healthcheck    # host.region muss "fra" sein
```

Danach:

1. `shopify.app.toml` auf `https://eu-compliance-suite.fly.dev` umstellen (application_url, drei redirect_urls,
   app_proxy url) und `shopify app deploy --allow-updates` ausführen.
2. Datenschutzerklärung wieder auf „Speicherung und Verarbeitung in Frankfurt“ setzen (Abschnitt 5, DE und EN) und
   die FAQ-Antwort auf der Landingpage anpassen.
3. Netlify-Seite als Weiterleitung stehen lassen oder abschalten.

## Rollback

Netlify bleibt unangetastet. Falls etwas klemmt: `shopify.app.toml` zurück auf
`https://smtp--eu-compliance-suite.netlify.app`, `shopify app deploy --allow-updates`, fertig.

## Warum nicht kostenlos

Geprüft am 11.09.2026: Koyeb (Frankfurt, gratis) und Render (gratis) fahren nach etwa einer Stunde ohne Traffic auf
null herunter. Ein Verbraucher, der auf „Vertrag widerrufen“ klickt, würde dann auf einen Kaltstart warten – bei einer
gesetzlich vorgeschriebenen Funktion nicht vertretbar. Vercel verbietet kommerzielle Nutzung im Gratis-Tarif,
Fly.io hat seit 2024 keinen Gratis-Tarif mehr, und Netlify erlaubt die Regionswahl erst ab 19 USD im Monat.
