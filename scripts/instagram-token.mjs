#!/usr/bin/env node
/**
 * Instagram 連携の下ごしらえを1回で終わらせるスクリプト。
 *
 * グラフAPIエクスプローラで取った「短期トークン」を渡すと、
 *   1. 長期ユーザートークン（60日）に交換
 *   2. 連携中の Facebook ページ一覧を取得
 *   3. ページアクセストークン（無期限）と Instagram ビジネスアカウント ID を表示
 * まで一気にやる。最後に .env に貼る内容をそのまま出力する。
 *
 * 使い方:
 *   node scripts/instagram-token.mjs \
 *     --app-id 1234567890 \
 *     --app-secret xxxxxxxx \
 *     --token <エクスプローラで生成した短期トークン>
 *
 * アプリ ID / シークレットは developers.facebook.com のアプリ →
 * 「アプリの設定」→「ベーシック」で確認できる。
 */

const GRAPH_VERSION = process.env.IG_GRAPH_VERSION || 'v23.0';
const BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

const args = parseArgs(process.argv.slice(2));
const appId = args['app-id'] ?? process.env.FB_APP_ID;
const appSecret = args['app-secret'] ?? process.env.FB_APP_SECRET;
const shortToken = args['token'];

if (!appId || !appSecret || !shortToken) {
  console.error(`
必要な引数が足りません。

  node scripts/instagram-token.mjs --app-id <ID> --app-secret <SECRET> --token <短期トークン>

--app-id / --app-secret は環境変数 FB_APP_ID / FB_APP_SECRET でも渡せます。
`);
  process.exit(1);
}

const longToken = await exchangeForLongLivedToken(shortToken);
console.log('\n■ 長期ユーザートークン（有効期限 約60日）\n');
console.log(longToken);

const pages = await listPages(longToken);
if (pages.length === 0) {
  console.error(`
Facebook ページが1つも取れませんでした。次を確認してください:
  - Instagram が「プロアカウント（ビジネス/クリエイター）」になっているか
  - その Instagram が Facebook ページに連携されているか
  - トークン生成時に pages_show_list の権限を付けたか
`);
  process.exit(1);
}

console.log('\n■ 連携中の Facebook ページ\n');
for (const page of pages) {
  const igId = page.instagram_business_account?.id;
  const igName = page.instagram_business_account?.username;
  console.log(`  ページ名 : ${page.name}`);
  console.log(`  ページID : ${page.id}`);
  console.log(`  Instagram: ${igId ? `${igId}${igName ? ` (@${igName})` : ''}` : '未連携'}`);
  console.log('');
}

const linked = pages.find((p) => p.instagram_business_account?.id);
if (!linked) {
  console.error('Instagram ビジネスアカウントが紐づいたページが見つかりませんでした。');
  process.exit(1);
}

console.log('■ .env にこの2行を貼ってください（ページアクセストークンは無期限）\n');
console.log(`IG_USER_ID=${linked.instagram_business_account.id}`);
console.log(`IG_ACCESS_TOKEN=${linked.access_token}`);
console.log('\n同じ2つを Vercel の Environment Variables にも登録すること。\n');

async function exchangeForLongLivedToken(token) {
  const url =
    `${BASE}/oauth/access_token?grant_type=fb_exchange_token` +
    `&client_id=${encodeURIComponent(appId)}` +
    `&client_secret=${encodeURIComponent(appSecret)}` +
    `&fb_exchange_token=${encodeURIComponent(token)}`;
  const data = await getJson(url, '長期トークンへの交換');
  return data.access_token;
}

async function listPages(token) {
  const url =
    `${BASE}/me/accounts` +
    `?fields=name,id,access_token,instagram_business_account{id,username}` +
    `&access_token=${encodeURIComponent(token)}`;
  const data = await getJson(url, 'ページ一覧の取得');
  return data.data ?? [];
}

async function getJson(url, label) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    console.error(`\n${label}に失敗しました: ${data?.error?.message ?? res.status}\n`);
    process.exit(1);
  }
  return data;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    out[argv[i].slice(2)] = argv[i + 1];
    i++;
  }
  return out;
}
