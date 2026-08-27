export const config = { runtime: 'edge' };

/**
 * Instagram 最新投稿を返す API
 *
 * 必要な環境変数（Vercel のプロジェクト設定 / ローカルは .env）:
 *   IG_USER_ID       … Instagram ビジネスアカウント ID（数字17桁程度）
 *   IG_ACCESS_TOKEN  … ページアクセストークン（無期限）または長期ユーザートークン（60日）
 *   IG_GRAPH_VERSION … 任意。既定 v23.0（Graph API のバージョン切替用）
 *
 * トークンは必ずサーバー側だけで扱う。フロントには絶対に出さないこと。
 */

const GRAPH_VERSION = process.env.IG_GRAPH_VERSION || 'v23.0';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

export default async function handler(req) {
  const token = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID;

  if (!token || !userId) {
    // 未設定でもサイトを壊さない。フロント側はフォールバック表示に切り替わる。
    return json({ error: 'not_configured', posts: [] }, 200);
  }

  const url = new URL(req.url);
  const limit = clampLimit(url.searchParams.get('limit'));

  const endpoint =
    `https://graph.facebook.com/${GRAPH_VERSION}/${userId}/media` +
    `?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (!res.ok) {
      // トークン期限切れなどはここに来る（data.error.message に理由が入る）
      return json(
        { error: 'instagram_api_error', details: data?.error?.message ?? null, posts: [] },
        res.status
      );
    }

    const posts = (data.data ?? []).map((m) => ({
      id: m.id,
      permalink: m.permalink,
      caption: m.caption ?? '',
      timestamp: m.timestamp,
      mediaType: m.media_type,
      // 動画はサムネイル、それ以外は画像 URL
      image: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
    }));

    return json({ posts }, 200, {
      // Vercel のエッジで1時間キャッシュ。裏側で再検証するので体感は常に即時。
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    });
  } catch (error) {
    return json({ error: 'fetch_failed', details: error.message, posts: [] }, 500);
  }
}

function clampLimit(raw) {
  const n = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(n)) return 12;
  return Math.min(Math.max(n, 1), 25);
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
