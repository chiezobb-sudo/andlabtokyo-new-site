import type { Knowledge, Price } from './microcms';

const hero = { url: '/dummy/hero.jpg', width: 1600, height: 900 };

export const dummyKnowledgeList: Knowledge[] = [
  {
    id: 'rawfood',
    title: 'ローフードとは？生の野菜や果物を活かした食事法',
    eyebrow: 'ローフードとは？効果・始め方・注意点まで解説',
    lead: 'ローフードとは、生の野菜や果物、ナッツ、発酵食品などを中心に、食材に含まれる酵素や栄養をできるだけ活かしていただく食事法です。一般的には48℃前後以下で調理し、加熱による栄養損失を抑えます。',
    heroImage: hero,
    heroImageAlt: 'ローフードのイメージ',
    body: '<h2>ローフードとは？</h2><p>ローフード（Raw Food）とは、生の野菜や果物、ナッツ、発酵食品などの「加熱しない食材」を中心とした食事法のことを指します。</p><p>"Raw＝生の"、"Food＝食べ物"という言葉の通り、48〜50℃以下の低温調理で仕上げるのが特徴です。</p><h2>ローフードの調理温度帯と酵素の働き</h2><p>ローフードでは、48〜50℃以下の低温で調理することが基本とされています。酵素の種類によって安定性や働く温度域が異なるため、厳密に一律ではありません。</p>',
    seoTitle: 'ローフードとは？効果・始め方・注意点を専門家が解説｜&LAB東京',
    seoDescription:
      'ローフードとは、生の野菜や果物、ナッツ、発酵食品を中心に、48℃前後以下で食材の酵素や栄養を活かす食事法です。&LAB東京が解説します。',
    publishedAt: '2026-01-01T00:00:00.000Z',
    revisedAt: '2026-08-18T00:00:00.000Z',
  },
  {
    id: 'livingfood',
    title: 'リビングフードとは？',
    lead: '（ダミー）リビングフードの解説記事です。',
    heroImage: hero,
    body: '<h2>リビングフードとは</h2><p>ダミーテキスト。</p>',
    seoDescription: '（ダミー）',
    publishedAt: '2026-01-01T00:00:00.000Z',
    revisedAt: '2026-01-01T00:00:00.000Z',
  },
];

export const dummyPrices: Price[] = [
  { id: '1', courseKey: 'rawchocolate-basic', label: 'BASIC・初級講座受講料', amount: 25000 },
  { id: '2', courseKey: 'rawchocolate-intermediate', label: 'INTERMEDIATE・中級講座受講料', amount: 35000 },
  { id: '3', courseKey: 'rawchocolate-advance', label: 'ADVANCE・上級講座受講料', amount: 43000 },
  { id: '4', courseKey: 'rawchocolate-3step', label: 'ローチョコレートマイスター® 3ステップ', amount: 103000 },
  { id: '5', courseKey: 'rawchocolate-pro', label: 'PRO・ジュニアローショコラティエ養成講座', amount: 85000 },
  { id: '6', courseKey: 'rawchocolate-total', label: '全課程 合計', amount: 188000, taxIncluded: 206800 },
];
