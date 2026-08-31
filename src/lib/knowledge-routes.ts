/**
 * ナレッジ記事のうち、Wix 時代から検索評価のある実URLで出すもの。
 *
 * 経緯（2026-08-31）: 移行時に解説記事が /knowledge/* へ移され、元URLには別の
 * ページが置かれていた。Search Console 実測で /rawchocolatier/whatrawsweets が
 * サイト最大の集客ページ（3か月 291クリック＝全体の21%）と判明したため、
 * 記事は元のURLで出し、/knowledge/<id> は 301 で寄せる。
 */
export const CUSTOM_ROUTES: Record<string, string> = {
  rawsweets: '/rawchocolatier/whatrawsweets',
  spirulina: '/spirulina',   // 3か月 215クリック / 24,676表示（表示回数はサイト最大）
};

/** ナレッジ記事の公開URLを返す */
export function knowledgeHref(id: string): string {
  return CUSTOM_ROUTES[id] ?? `/knowledge/${id}`;
}
