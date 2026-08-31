/**
 * 講座ではないページ（読みもの・書籍・プロジェクト紹介）の構造化データ。
 * Course を名乗ると検索側に誤情報を渡すので、こちらは Article を使う。
 */
const SITE = 'https://www.andlabtokyo.com';

type Args = {
  path: string;
  headline: string;
  description: string;
  image: string;
  faq?: { q: string; a: string }[];
  breadcrumb?: { name: string; path?: string }[];
  published?: string;
  modified?: string;
  lang?: 'ja' | 'en';
  /** 書籍ページのときだけ渡す */
  book?: {
    name: string;
    author: string;
    isbn?: string;
    url?: string;
    ratingValue?: string;
    reviewCount?: string;
    reviews?: { body: string; who: string }[];
  };
};

export function articleJsonLd(a: Args) {
  const url = `${SITE}${a.path}`;
  const en = a.lang === 'en';
  const graph: any[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: a.headline,
      description: a.description,
      url,
      image: a.image.startsWith('http') ? a.image : `${SITE}${a.image}`,
      inLanguage: en ? 'en' : 'ja',
      ...(a.published ? { datePublished: a.published } : {}),
      ...(a.modified ? { dateModified: a.modified } : {}),
      author: { '@id': `${SITE}/instructor-chie-ando#person` },
      publisher: { '@type': 'EducationalOrganization', name: '&LAB TOKYO', url: SITE },
      mainEntityOfPage: url,
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/instructor-chie-ando#person`,
      name: '安藤 千英',
      jobTitle: 'ローフード国際プロデューサー／ELLE gourmet 認定クリエイター',
      url: `${SITE}/instructor-chie-ando`,
    },
  ];

  if (a.book) graph.push({
    '@type': 'Book',
    '@id': `${url}#book`,
    name: a.book.name,
    author: { '@type': 'Person', name: a.book.author },
    ...(a.book.isbn ? { isbn: a.book.isbn } : {}),
    ...(a.book.url ? { url: a.book.url } : {}),
    inLanguage: 'ja',
    ...(a.book.ratingValue && a.book.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: a.book.ratingValue,
        reviewCount: a.book.reviewCount,
        bestRating: '5',
      },
    } : {}),
    ...(a.book.reviews?.length ? {
      review: a.book.reviews.map((r) => ({
        '@type': 'Review', reviewBody: r.body, author: { '@type': 'Person', name: r.who },
      })),
    } : {}),
  });

  if (a.faq?.length) graph.push({
    '@type': 'FAQPage', '@id': `${url}#faq`,
    mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: en ? 'Home' : 'ホーム', item: `${SITE}/` },
      ...(a.breadcrumb ?? [{ name: a.headline }]).map((b, i) => ({
        '@type': 'ListItem', position: i + 2, name: b.name, ...(b.path ? { item: `${SITE}${b.path}` } : {}),
      })),
    ],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}
