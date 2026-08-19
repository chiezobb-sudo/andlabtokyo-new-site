import { createClient } from 'microcms-js-sdk';

// ── 既存ページ用クライアント（rawchocolatemeister等で直接使用）──
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// ── 既存ページで使用中の型 ──
export type Course = {
  id: string;
  title: string;
  description: string;
  price: string;
  schedule: string;
  heroImage?: { url: string };
};

// ── knowledge / price セクション型 ──
export type MicroCMSImage = { url: string; width: number; height: number };

export type Knowledge = {
  id: string;
  title: string;
  eyebrow?: string;
  lead: string;
  heroImage: MicroCMSImage;
  heroImageAlt?: string;
  body: string;  // richEditorV2 → HTML文字列
  seoTitle?: string;
  seoDescription: string;
  ogImage?: MicroCMSImage;
  noindex?: boolean;
  faq?: { question: string; answer: string }[];
  // 記事末尾のCTA（講座LPへの導線）。料金は書かない
  ctaHeading?: string;
  ctaText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  publishedAt: string;
  revisedAt: string;
};

export type Price = {
  id: string;
  courseKey: string;
  label: string;
  amount: number;
  taxIncluded?: number;
  note?: string;
  sortOrder?: number;
};

// ── CMS未接続でもビルドが通るフォールバック付きクライアント ──
const domain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const key = import.meta.env.MICROCMS_API_KEY;
export const cmsReady = Boolean(domain && key);
const safeClient = cmsReady ? client : null;

export async function getKnowledgeList(): Promise<Knowledge[]> {
  if (!safeClient) {
    const { dummyKnowledgeList } = await import('./dummy');
    return dummyKnowledgeList;
  }
  const res = await safeClient.getList<Knowledge>({ endpoint: 'knowledge', queries: { limit: 100 } });
  return res.contents;
}

export async function getKnowledge(contentId: string): Promise<Knowledge> {
  if (!safeClient) {
    const { dummyKnowledgeList } = await import('./dummy');
    const hit = dummyKnowledgeList.find((a) => a.id === contentId);
    if (!hit) throw new Error(`dummy article not found: ${contentId}`);
    return hit;
  }
  return safeClient.getListDetail<Knowledge>({ endpoint: 'knowledge', contentId });
}

export async function getPrices(): Promise<Price[]> {
  if (!safeClient) {
    const { dummyPrices } = await import('./dummy');
    return dummyPrices;
  }
  const res = await safeClient.getList<Price>({ endpoint: 'price', queries: { limit: 100 } });
  return res.contents;
}

export const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

// ─────────────────────────────────────────────
// Page builder types (pages API)
// ─────────────────────────────────────────────

export type HeroBlock = {
  fieldId: 'hero';
  eyebrow?: string;
  mainCopy: string;
  accentWord?: string;
  subCopy?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaLabel2?: string;
  ctaUrl2?: string;
  bgImage?: MicroCMSImage;
  videoUrl?: string;  // 例: /hero-video.mp4
};

export type ConceptBandBlock = {
  fieldId: 'conceptBand';
  catchcopy: string;
  leadText?: string;
};

export type CourseItem = {
  fieldId: 'courseItem';
  cat: string;
  name: string;
  url: string;
  theme: 'choco' | 'ferm' | 'raw' | 'workshop' | 'patis';
};

export type CourseGridBlock = {
  fieldId: 'courseGrid';
  label?: string;
  heading: string;
  items: CourseItem[];
};

export type KnowledgeGridBlock = {
  fieldId: 'knowledgeGrid';
  label?: string;
  heading: string;
  count?: number;
};

export type ProfileBandBlock = {
  fieldId: 'profileBand';
  label?: string;
  name: string;
  nameEn?: string;
  subText?: string;
  description: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image?: MicroCMSImage;
};

export type RichSectionBlock = {
  fieldId: 'richSection';
  label?: string;
  heading?: string;
  body: string;
  image?: MicroCMSImage;
  imagePosition?: 'right' | 'left' | 'none';
  ctaLabel?: string;
  ctaUrl?: string;
};

export type SliderItem = {
  fieldId: 'sliderItem';
  image?: MicroCMSImage;
  title?: string;
  text?: string;
  url?: string;
  videoUrl?: string;
};

export type SliderAreaBlock = {
  fieldId: 'sliderArea';
  slides: SliderItem[];
};

export type PageBlock =
  | HeroBlock
  | ConceptBandBlock
  | CourseGridBlock
  | KnowledgeGridBlock
  | ProfileBandBlock
  | RichSectionBlock
  | SliderAreaBlock;

export type Page = {
  id: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: MicroCMSImage;
  blocks: PageBlock[];
};

export async function getPage(slug: string): Promise<Page | null> {
  const { dummyPages } = await import('./dummy-page');
  if (!safeClient) return dummyPages[slug] ?? null;
  try {
    const res = await safeClient.getList<Page>({
      endpoint: 'pages',
      queries: { filters: `slug[equals]${slug}`, limit: 1 },
    });
    // pages API がまだ存在しない・コンテンツが空の場合はダミーにフォールバック
    return res.contents[0] ?? dummyPages[slug] ?? null;
  } catch {
    return dummyPages[slug] ?? null;
  }
}
