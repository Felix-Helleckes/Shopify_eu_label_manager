#!/usr/bin/env bash
# Copies the runtime configuration from Netlify to Fly.io.
#
#   ./scripts/fly-secrets.sh [app-name]
#
# Secret values only travel between the two CLIs on this machine; nothing is printed.
# Requires: netlify-cli logged in, flyctl logged in (`fly auth login`).
set -euo pipefail

APP="${1:-eu-compliance-suite}"
SITE_ID="${NETLIFY_SITE_ID:-16223432-5f96-4ba0-a0e0-96562ceb2ca2}"
APP_URL="https://${APP}.fly.dev"

command -v fly >/dev/null 2>&1 || { echo "flyctl not found – add ~/.fly/bin to your PATH"; exit 1; }

echo "Reading configuration from Netlify…"
NETLIFY_SITE_ID="$SITE_ID" npx netlify-cli env:list --json > /tmp/eu-env.json

echo "Writing secrets to Fly app '$APP' (URL: $APP_URL)…"
python3 - "$APP_URL" <<'PY' > /tmp/eu-env.txt
import json, sys
app_url = sys.argv[1]
data = json.load(open("/tmp/eu-env.json"))
# NODE_VERSION is a Netlify build setting; the app URL changes with the host.
skip = {"NODE_VERSION"}
data["SHOPIFY_APP_URL"] = app_url
for key, value in data.items():
    if key in skip or value is None:
        continue
    print(f"{key}={value}")
PY

fly secrets import --app "$APP" < /tmp/eu-env.txt
rm -f /tmp/eu-env.json /tmp/eu-env.txt

echo
echo "Done. Next:"
echo "  fly deploy --app $APP"
echo "  curl -s https://${APP}.fly.dev/healthcheck   # host.region must be 'fra'"
