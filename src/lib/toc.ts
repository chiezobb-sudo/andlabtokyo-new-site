/** 見出し文字列から URL に使える id を作る（日本語はそのまま残す） */
export const slugifyHeading = (s: string, i: number) =>
  `sec-${i + 1}-` +
  s.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 40);

export type TocItem = { id: string; label: string };

/** richEditorV2（HTML文字列）から h2 タグを抽出して目次を生成する */
export const buildToc = (body: string): TocItem[] => {
  const items: TocItem[] = [];
  const re = /<h2[^>]*>(.*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(body)) !== null) {
    const label = m[1].replace(/<[^>]+>/g, '').trim();
    if (label) items.push({ id: slugifyHeading(label, i++), label });
  }
  return items;
};
