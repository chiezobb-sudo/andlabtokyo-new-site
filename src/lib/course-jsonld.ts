/**
 * 講座ページの構造化データを組み立てる。
 * 検索（Google）と生成AI（GEO）の両方に、事実をそのまま渡すのが目的。
 * 各ページで同じものを書かないよう1箇所にまとめた。
 */
const SITE = 'https://www.andlabtokyo.com';

type Args = {
  path: string;                 // 例 '/rawchocolatier/nutfreerawsweets'
  name: string;
  description: string;
  image: string;
  teaches?: string[];
  credential?: string;
  offers?: { name: string; price: string }[];
  reviews?: { body: string; who: string }[];
  faq?: { q: string; a: string }[];
  breadcrumb?: { name: string; path?: string }[];
  online?: boolean;
  onsite?: boolean;
  published?: string;
  modified?: string;
  /** 'en' を渡すと言語・税表記・パンくずを英語にする（麹体験ページ用） */
  lang?: 'ja' | 'en';
  /** 価格の税表記。既定は日本語ページの「税別」 */
  taxLabel?: string;
};

export function courseJsonLd(a: Args) {
  const url = `${SITE}${a.path}`;
  const en = a.lang === 'en';
  const taxLabel = a.taxLabel ?? (en ? 'Tax included' : '税別');
  const num = (s: string) => s.replace(/[^0-9]/g, '');
  const instances: any[] = [];
  if (a.onsite !== false) instances.push({
    '@type': 'CourseInstance', courseMode: 'onsite', name: '対面レッスン（東京・表参道）',
    location: { '@type': 'Place', name: '&LAB TOKYO',
      address: { '@type': 'PostalAddress', streetAddress: '神宮前', addressLocality: '渋谷区', addressRegion: '東京都', addressCountry: 'JP' } },
  });
  if (a.online) instances.push({ '@type': 'CourseInstance', courseMode: 'online', name: 'オンラインレッスン' });

  const graph: any[] = [{
    '@type': 'Course',
    '@id': `${url}#course`,
    name: a.name,
    description: a.description,
    url,
    image: a.image.startsWith('http') ? a.image : `${SITE}${a.image}`,
    inLanguage: en ? 'en' : 'ja',
    ...(a.teaches?.length ? { teaches: a.teaches } : {}),
    ...(a.credential ? { educationalCredentialAwarded: a.credential } : {}),
    ...(a.published ? { datePublished: a.published } : {}),
    ...(a.modified ? { dateModified: a.modified } : {}),
    author: { '@id': `${SITE}/instructor-chie-ando#person` },
    provider: { '@type': 'EducationalOrganization', name: '&LAB TOKYO', url: SITE },
    ...(a.offers?.length ? { offers: a.offers.map((o) => ({
      '@type': 'Offer', name: o.name, price: num(o.price), priceCurrency: 'JPY',
      category: taxLabel, availability: 'https://schema.org/InStock',
    })) } : {}),
    ...(a.reviews?.length ? { review: a.reviews.map((r) => ({
      '@type': 'Review', reviewBody: r.body,
      author: { '@type': 'Person', name: r.who },
      itemReviewed: { '@id': `${url}#course` },
    })) } : {}),
    ...(instances.length ? { hasCourseInstance: instances } : {}),
  }, {
    '@type': 'Person',
    '@id': `${SITE}/instructor-chie-ando#person`,
    name: en ? 'Chie Ando' : '安藤 千英',
    jobTitle: en
      ? 'Chef, author and international raw food producer'
      : 'ローフード国際プロデューサー／ELLE gourmet 認定クリエイター',
    url: `${SITE}/instructor-chie-ando`,
  }];

  if (a.faq?.length) graph.push({
    '@type': 'FAQPage', '@id': `${url}#faq`,
    mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: en ? 'Home' : 'ホーム', item: `${SITE}/` },
      ...(a.breadcrumb ?? [{ name: a.name }]).map((b, i) => ({
        '@type': 'ListItem', position: i + 2, name: b.name, ...(b.path ? { item: `${SITE}${b.path}` } : {}),
      }))],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}
