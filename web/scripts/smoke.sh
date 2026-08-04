#!/usr/bin/env bash
# Smoke-test Poligraph under /poligraph basePath (local next start).
set -euo pipefail
BASE="${1:-http://127.0.0.1:3000/poligraph}"
fail=0
for p in "" /survey /explore /compare /results /methodology /privacy /mockup; do
  url="${BASE}${p}"
  code=$(curl -sL -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [[ "$code" == "200" ]]; then
    echo "OK  $code $url"
  else
    echo "FAIL $code $url"
    fail=1
  fi
done
exit $fail
