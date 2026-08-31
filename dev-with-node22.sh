#!/bin/bash
export PATH="/Users/chie/.nvm/versions/node/v22.22.3/bin:$PATH"
cd /Users/chie/Sites/andlabtokyo-new-site
# PORT が渡されていればそれを使う（渡されなければ Astro 既定の 4321）
exec npm run dev -- --port "${PORT:-4321}"
