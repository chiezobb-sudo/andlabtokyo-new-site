/**
 * Wix → microCMS 移行スクリプト
 *
 * 使い方:
 *   1. .env に MICROCMS_SERVICE_DOMAIN と MICROCMS_WRITE_API_KEY を設定
 *      （WRITE_API_KEYは管理画面の「API」→「書き込みAPI」から取得）
 *   2. node scripts/wix-to-microcms.mjs --dry-run [--slug=rawfood]
 *   3. 内容確認後: node scripts/wix-to-microcms.mjs [--slug=rawfood]
 *
 * オプション:
 *   --dry-run     microCMSに投稿せず scripts/dry-run-{slug}.json に出力
 *   --slug=xxx    1記事だけ処理
 */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// 環境変数 (.env 読み込み)
// ---------------------------------------------------------------------------
try {
  const raw = readFileSync('.env', 'utf-8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) process.env[m[1]] ??= m[2].trim();
  }
} catch { /* .env なければ無視 */ }

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_KEY = process.env.MICROCMS_WRITE_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

if (!DRY_RUN && (!SERVICE_DOMAIN || !WRITE_KEY)) {
  console.error('❌ .env に MICROCMS_SERVICE_DOMAIN と MICROCMS_WRITE_API_KEY が必要です');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 対象6記事
// ---------------------------------------------------------------------------
const ARTICLES = [
  {
    url: 'https://www.andlabtokyo.com/rawfood',
    slug: 'rawfood',
    eyebrow: 'ローフードとは？効果・始め方・注意点まで解説',
    seoDescription: 'ローフードとは何か、始め方・効果・注意点をわかりやすく解説。生の野菜や果物、ナッツを活かす食事法を、ローショコラティエ協会の安藤千英が説明します。',
    cta: { heading: 'ローフードを、もっと深く学ぶ', text: '&LAB TOKYOでは、定義から学べる講座を開講しています。', buttonLabel: '講座を見る', buttonUrl: '/rawfood-kentei-meister' },
  },
  {
    url: 'https://www.andlabtokyo.com/fermentedfood',
    slug: 'fermentedfood',
    eyebrow: '発酵食とは？腸内環境を整える伝統的な健康食',
    seoDescription: '発酵食とは何か、腸内環境への作用・日本の発酵食品一覧・選び方を解説。ローショコラティエ協会の安藤千英が、科学的根拠に基づいて説明します。',
    cta: { heading: '発酵を体でわかる人になる', text: '発酵プランナー講座では、基礎から実践まで学べます。', buttonLabel: '講座を見る', buttonUrl: '/fermentation' },
  },
  {
    url: 'https://www.andlabtokyo.com/livingfood',
    slug: 'livingfood',
    eyebrow: 'リビングフードとは',
    seoDescription: 'リビングフードとは何か、ローフードとの違い・発酵との関係を解説。&LAB TOKYOが提唱するシン・リビングフードの考え方も紹介します。',
    cta: { heading: 'リビングフードを学ぶ', text: '定義から体系的に学べる講座があります。', buttonLabel: '講座を見る', buttonUrl: '/rawfood-kentei-meister' },
  },
  {
    url: 'https://www.andlabtokyo.com/rawchocolatier/rawchocolate',
    slug: 'rawchocolate',
    eyebrow: 'ローチョコレートとは',
    seoDescription: 'ローチョコレートの正確な定義・高温焙煎との違い・カカオの発酵温度まで解説。ローショコラティエ協会 代表の安藤千英が説明します。',
    cta: { heading: 'ローチョコレートを正確に学ぶ', text: '定義・発酵・素材識別・衛生まで体系的に学べる講座です。', buttonLabel: 'マイスター講座を見る', buttonUrl: '/rawchocolatier/rawchocolatemeister' },
  },
  {
    url: 'https://www.andlabtokyo.com/rawchocolatier/whatrawsweets',
    slug: 'rawsweets',
    eyebrow: 'ロースイーツとは',
    seoDescription: 'ロースイーツとは何か、普通のスイーツとの違い・使う素材・注意点をわかりやすく解説。&LAB TOKYOが提唱するジェントルスイーツの考え方も紹介。',
    cta: { heading: 'ロースイーツを学ぶ', text: '初級（ジェントルスイーツ）から、ローパティシエ®まで学べます。', buttonLabel: 'ロースイーツ講座を見る', buttonUrl: '/rawchocolatier/rawpatissier' },
  },
  {
    url: 'https://www.andlabtokyo.com/spirulina',
    slug: 'spirulina',
    eyebrow: 'スピルリナとは',
    seoDescription: 'スピルリナとは何か、栄養素・選び方・摂り方を解説。&LAB TOKYOのスピルリナラボが、科学的根拠に基づいて説明します。',
    cta: { heading: 'スピルリナを使う', text: '実際のレシピを公開しています。', buttonLabel: 'レシピを見る', buttonUrl: 'https://cookpad.com/jp/users/40053501' },
  },
];


// ---------------------------------------------------------------------------
// Wix由来のクラス・インラインスタイルを除去する
//   目的: 新サイト側のCSS（デザイントークン）が効くようにする。
//   Wixの class="color_36" 等は新サイトに存在せず、style="font-size:23px" は
//   こちらの指定を上書きしてしまうため、意味のあるもの（太字）だけ残して捨てる。
// ---------------------------------------------------------------------------
function sanitizeHtml(html) {
  if (!html) return html;
  const $ = load(`<div id="__r">${html}</div>`, null, false);

  // 太字だけは <strong> に変換して残す
  $('#__r span').each((_, el) => {
    const st = $(el).attr('style') || '';
    if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(st)) {
      $(el).replaceWith(`<strong>${$(el).html() ?? ''}</strong>`);
    }
  });

  $('#__r [class]').removeAttr('class');
  $('#__r [style]').removeAttr('style');

  // 属性のなくなった span を外す（入れ子があるので繰り返す）
  for (let i = 0; i < 8; i++) {
    let changed = false;
    $('#__r span').each((_, el) => {
      if (Object.keys(el.attribs || {}).length === 0) {
        $(el).replaceWith($(el).html() ?? '');
        changed = true;
      }
    });
    if (!changed) break;
  }

  // 中身のない段落を削除
  $('#__r p, #__r strong').each((_, el) => {
    const t = $(el).text().replace(/[\s\u200b\u00a0]/g, '');
    if (!t && $(el).find('img').length === 0) $(el).remove();
  });

  return ($('#__r').html() ?? '').trim();
}


// ---------------------------------------------------------------------------
// Wixの画像を microCMS のメディアへ移す
//   microCMSの画像フィールドは自前のメディアURLしか受け付けない。
//   またWixを解約すると画像が消えるため、この移行は必須。
// ---------------------------------------------------------------------------
const mediaCache = new Map();

async function uploadToMicroCMS(imageUrl) {
  if (!imageUrl) return null;
  if (mediaCache.has(imageUrl)) return mediaCache.get(imageUrl);

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`画像の取得に失敗 (${res.status}): ${imageUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());

  // ファイル名は元URLの末尾から。クエリは落とす
  const name = (imageUrl.split('/').pop() || 'image.jpg').split('?')[0].replace(/[^\w.\-]/g, '_');
  const type = res.headers.get('content-type') || 'image/jpeg';

  const form = new FormData();
  form.append('file', new Blob([buf], { type }), name);

  const up = await fetch(`https://${SERVICE_DOMAIN}.microcms-management.io/api/v1/media`, {
    method: 'POST',
    headers: { 'X-MICROCMS-API-KEY': WRITE_KEY },
    body: form,
  });
  const json = await up.json();
  if (!up.ok) throw new Error(`メディアのアップロードに失敗 (${up.status}): ${JSON.stringify(json)}`);

  mediaCache.set(imageUrl, json.url);
  return json.url;
}

// ---------------------------------------------------------------------------
// ユーティリティ
// ---------------------------------------------------------------------------

/** ゼロ幅スペース・不可視文字を除去して「実質的に空」か判定 */
const isEmpty = (str) => !str?.replace(/[​‌‍﻿\s]/g, '');

/** Wix画像URLを高解像度版に変換 */
const toFullRes = (src) =>
  src.replace(/\/v1\/fill\/[^/]+\//, '/v1/fill/w_1400,q_90,enc_avif/');

/** Wix内部URLを /knowledge/slug 形式に変換 */
const convertInternalUrl = (href = '') => {
  if (!href || href.startsWith('http')) return href;
  // /rawfood → /knowledge/rawfood など
  const SLUG_MAP = {
    '/rawfood': '/knowledge/rawfood',
    '/fermentedfood': '/knowledge/fermentedfood',
    '/livingfood': '/knowledge/livingfood',
    '/rawchocolatier/rawchocolate': '/knowledge/rawchocolate',
    '/rawchocolatier/whatrawsweets': '/knowledge/rawsweets',
    '/spirulina': '/knowledge/spirulina',
  };
  return SLUG_MAP[href] || href;
};

// ---------------------------------------------------------------------------
// 画像アップロード（microCMSメディア）
// ---------------------------------------------------------------------------
async function uploadImage(imageUrl) {
  if (!imageUrl || imageUrl.startsWith('data:')) return null;
  if (DRY_RUN) return { url: imageUrl, width: 1400, height: 788 };

  try {
    const imgRes = await fetch(toFullRes(imageUrl));
    if (!imgRes.ok) return { url: imageUrl, width: 1400, height: 788 };

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const filename = path.basename(new URL(imageUrl).pathname) || 'image.jpg';

    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: contentType }), filename);

    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/management/media`,
      { method: 'POST', headers: { 'X-MICROCMS-API-KEY': WRITE_KEY }, body: formData }
    );

    if (!res.ok) {
      console.warn(`    ⚠️  画像アップロード失敗 (${filename}) → Wix URLで代替`);
      return { url: imageUrl, width: 1400, height: 788 };
    }
    const data = await res.json();
    console.log(`    📷 画像: ${filename}`);
    return { url: data.url, width: data.width || 1400, height: data.height || 788 };

  } catch (e) {
    console.warn(`    ⚠️  画像エラー: ${e.message}`);
    return { url: imageUrl, width: 1400, height: 788 };
  }
}

// ---------------------------------------------------------------------------
// メインパーサー（Wix HTML → Knowledge ブロック）
// ---------------------------------------------------------------------------
async function parse(html, meta) {
  const $ = load(html);

  // --- タイトル ---
  const title = $('h1').first().text().trim() || meta.eyebrow;

  // --- OGP画像（ヒーロー） ---
  const ogImageUrl = $('meta[property="og:image"]').attr('content') || '';
  const heroImage = await uploadImage(ogImageUrl);

  // --- OGPから取れるリード文（フォールバック用） ---
  const ogDescription = $('meta[property="og:description"], meta[name="description"]').attr('content') || '';

  // --- コンテンツのh2/h3/pを抽出 ---
  // Wixの本文クラスは wixui-rich-text。それ以外の h2/p（ナビ等）は除外。
  // ただし見出しは wixui-rich-text の外にある場合もあるため、
  // 「目次」より後にある▶︎付きh2を除外し、空白h2も除外するフィルタで対応。

  const blocks = [];
  const faqItems = [];
  let inToc = false;        // 目次区間中か
  let tocSkipMode = false;  // TOC通過後・最初のコンテンツp待ちモード
  let pendingH2 = null;     // tocSkipMode中に保留するh2テキスト
  let inFaq = false;        // FAQ区間中か
  let currentSection = null;
  let leadParagraphs = [];
  let leadDone = false;     // 最初のh2（実コンテンツ）が来たら lead 収集終了
  let pendingFaqQ = null;

  // ▶︎始まりか空のh2 = 目次リンク or スペーサー（rawfood形式）
  const isArrowTocH2 = (text) => text.startsWith('▶') || text.startsWith('►') || isEmpty(text);

  // 処理対象セレクタ。wixui-rich-text を優先しつつ、h2は全体から拾う
  const els = $('h1, h2, h3, h4, p, img').toArray();

  for (const el of els) {
    const tag = el.tagName.toLowerCase();
    const $el = $(el);
    const rawText = $el.text();
    const text = rawText.replace(/[​‌‍﻿]/g, '').trim();

    // h1 はスキップ（title として既に取得済み）
    if (tag === 'h1') continue;

    // ------------------------------------------------------------------
    // h2
    // ------------------------------------------------------------------
    if (tag === 'h2') {
      // 「目次」h2 → TOC区間開始
      if (text === '目次' || text === 'もくじ') { inToc = true; continue; }

      // TOC内のh2
      if (inToc) {
        if (isArrowTocH2(text)) continue; // ▶︎リンク or 空白はスキップ
        // ▶︎なしのTOCリンク（fermentedfood形式）→ TOC終了してskipModeへ
        inToc = false;
        tocSkipMode = true;
        pendingH2 = text;
        continue;
      }

      // tocSkipMode: コンテンツpが来るまでh2を保留
      if (tocSkipMode) {
        pendingH2 = text;
        continue;
      }

      // TOC前の▶︎h2 or 空白h2 → スキップ
      if (isArrowTocH2(text)) continue;

      // FAQ h2
      if (text.match(/FAQ|よくある質問|Q&A/i)) {
        if (currentSection) { blocks.push(currentSection); currentSection = null; }
        inFaq = true;
        continue;
      }

      // 通常のセクション h2
      leadDone = true;
      if (currentSection) blocks.push(currentSection);
      currentSection = { fieldId: 'section', heading: text, richText: '' };
      continue;
    }

    // ------------------------------------------------------------------
    // h3 → subsection
    // ------------------------------------------------------------------
    if (tag === 'h3' && !inToc) {
      if (inFaq) {
        // FAQ内のh3はQ
        pendingFaqQ = text;
        continue;
      }
      leadDone = true;
      if (currentSection) { blocks.push(currentSection); currentSection = null; }
      blocks.push({ fieldId: 'subsection', heading: text, richText: '' });
      continue;
    }

    // ------------------------------------------------------------------
    // img
    // ------------------------------------------------------------------
    if (tag === 'img' && !inToc && leadDone) {
      const src = $el.attr('src') || $el.attr('data-src') || '';
      if (!src || src.startsWith('data:')) continue;
      // ナビゲーションアイコン等の小さい画像は無視
      const w = parseInt($el.attr('width') || '0');
      if (w > 0 && w < 60) continue;

      // sectionアイコンサイズ（50〜200px）
      if (currentSection && w > 50 && w <= 200) {
        if (!currentSection.icon) {
          const uploaded = await uploadImage(src);
          if (uploaded) currentSection.icon = uploaded;
        }
        continue;
      }

      // 大きい画像 → imageBlock
      const alt = $el.attr('alt') || '';
      const uploaded = await uploadImage(src);
      if (uploaded) {
        if (currentSection) { blocks.push(currentSection); currentSection = null; }
        blocks.push({ fieldId: 'imageBlock', image: uploaded, alt });
      }
      continue;
    }

    // ------------------------------------------------------------------
    // p
    // ------------------------------------------------------------------
    if (tag === 'p') {
      // Wixのナビや不可視pは除外（20文字未満の実質空 or ナビメニュー）
      if (isEmpty(text)) continue;
      if (!inFaq && text.length < 5) continue;

      // TOC区間内はスキップ
      if (inToc) continue;

      // FAQ区間
      if (inFaq) {
        if (pendingFaqQ) {
          // Answerが来た
          faqItems.push({ question: pendingFaqQ, answer: text });
          pendingFaqQ = null;
        } else {
          // Q&A を Q/A 交互で拾う
          if (text.match(/^Q[：:.]/i)) {
            pendingFaqQ = text.replace(/^Q[：:.]\s*/i, '').trim();
          }
        }
        continue;
      }

      // tocSkipMode解除: 実コンテンツp（100字以上）が来たらskipMode終了
      if (tocSkipMode && text.length >= 60) {
        tocSkipMode = false;
        leadDone = true;
        if (pendingH2) {
          if (currentSection) blocks.push(currentSection);
          currentSection = { fieldId: 'section', heading: pendingH2, richText: '' };
          pendingH2 = null;
        }
        // このpはcurrentSectionに追加（下の通常処理へ fallthrough）
      }

      // linkCard（▶︎で始まる段落）
      if (text.match(/^[▶►→]/)) {
        const label = text.replace(/^[▶►→]\s*/, '').replace(/はこちら|を見る|について詳しくはこちら/, '').trim();
        const href = $el.find('a').attr('href') || '';
        const convertedHref = convertInternalUrl(href);
        if (currentSection) { blocks.push(currentSection); currentSection = null; }
        blocks.push({ fieldId: 'linkCard', label, externalUrl: convertedHref || undefined });
        leadDone = true;
        continue;
      }

      // リード文（目次が来る前のp）
      if (!leadDone && leadParagraphs.length < 3) {
        // ナビ・メニューではない実文（50文字以上）のみ
        if (text.length >= 50) leadParagraphs.push(text);
        continue;
      }

      // 通常の段落 → 現在のsectionまたはsubsectionに追加
      const pHtml = `<p>${$el.html()}</p>`;
      if (currentSection) {
        currentSection.richText += pHtml;
      } else {
        const last = blocks[blocks.length - 1];
        if (last && (last.fieldId === 'section' || last.fieldId === 'subsection')) {
          last.richText = (last.richText || '') + pHtml;
        }
      }
      continue;
    }
  }

  // 最後のsectionを確定
  if (currentSection) blocks.push(currentSection);

  // リード文（本文p優先 → OGP description → フォールバック）
  const lead = leadParagraphs.slice(0, 2).join(' ') ||
    ogDescription ||
    `${title}について、定義・特徴・注意点をわかりやすく解説します。`;

  return { title, lead, heroImage, blocks, faqItems };
}

// ---------------------------------------------------------------------------
// ブロック配列 → HTML文字列（richEditorV2 用）
// ---------------------------------------------------------------------------
function blocksToHtml(blocks) {
  return blocks.map(b => {
    switch (b.fieldId) {
      case 'section':
        return `<h2>${b.heading}</h2>${b.richText || ''}`;
      case 'subsection':
        return `<h3>${b.heading}</h3>${b.richText || ''}`;
      case 'imageBlock': {
        const cap = b.caption ? `<figcaption>${b.caption}</figcaption>` : '';
        return `<figure><img src="${b.image.url}" alt="${b.alt || ''}" />${cap}</figure>`;
      }
      case 'linkCard': {
        const href = b.externalUrl || '#';
        return `<p><a href="${href}">${b.label}</a></p>`;
      }
      case 'quoteBlock':
        return `<blockquote><p>${b.text}</p><cite>${b.source}</cite></blockquote>`;
      case 'noteBlock':
        return `<p class="note">${b.text}</p>`;
      case 'tableBlock': {
        const headers = b.header.split(',');
        const rows = (b.rows || []).map(r => r.cells.split(','));
        const cap = b.caption ? `<caption>${b.caption}</caption>` : '';
        const head = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        const body = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
        return `<figure><table>${cap}${head}${body}</table></figure>`;
      }
      case 'bookBlock':
        return [
          '<div class="book-block">',
          `<strong>${b.title}</strong>`,
          b.author ? ` ／ ${b.author}` : '',
          b.comment ? `<p>${b.comment}</p>` : '',
          '</div>',
        ].join('');
      default:
        return '';
    }
  }).filter(Boolean).join('\n');
}

function faqToHtml(faqs) {
  if (!faqs.length) return '';
  const items = faqs.map(f =>
    `<dt>${f.question}</dt><dd>${f.answer}</dd>`
  ).join('\n');
  return `<h2>よくある質問</h2>\n<dl>\n${items}\n</dl>`;
}

// ---------------------------------------------------------------------------
// microCMSへの書き込み（PUT = IDを指定して作成 or 更新）
// ---------------------------------------------------------------------------
async function postToMicroCMS(slug, payload) {
  if (DRY_RUN) {
    mkdirSync('scripts', { recursive: true });
    const outPath = `scripts/dry-run-${slug}.json`;
    writeFileSync(outPath, JSON.stringify(payload, null, 2));
    console.log(`  💾 dry-run → ${outPath}`);
    return;
  }

  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/knowledge/${slug}`,
    {
      method: 'PUT',
      headers: { 'X-MICROCMS-API-KEY': WRITE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`microCMS PUT失敗 (${res.status}): ${body}`);
  }
  const data = await res.json();
  console.log(`  ✅ 投稿完了: ${data.id}`);
}

// ---------------------------------------------------------------------------
// 1記事の処理フロー
// ---------------------------------------------------------------------------
async function processArticle(meta) {
  console.log(`\n📄 ${meta.slug}  ${meta.url}`);

  const res = await fetch(meta.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; andlab-migrator/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const { title, lead, heroImage, blocks, faqItems } = await parse(html, meta);

  const filteredBlocks = blocks.filter(b => {
    if (b.fieldId === 'section') {
      if (isEmpty(b.heading)) return false;
      if (!b.richText && !b.icon && !b.image) return false;
      const footer = ['&LAB TOKYO', 'SUPPORT', 'サポート', 'お問い合わせ'];
      if (footer.some(f => b.heading.includes(f))) return false;
    }
    return true;
  });

  let bodyHtml = [
    blocksToHtml(filteredBlocks),
    faqToHtml(faqItems),
  ].filter(Boolean).join('\n');

  bodyHtml = sanitizeHtml(bodyHtml);

  // 冒頭に eyebrow と同じ文が重複していたら落とす
  if (meta.eyebrow) {
    const dup = new RegExp(`<p>\\s*(<strong>)?\\s*${meta.eyebrow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(</strong>)?\\s*</p>`, 'g');
    bodyHtml = bodyHtml.replace(dup, '');
  }

  // 画像を microCMS へ移す（dry-run のときは移さない）
  let heroImageUrl = heroImage;
  if (!DRY_RUN && heroImage) {
    const src = typeof heroImage === 'object' ? heroImage.url : heroImage;
    heroImageUrl = await uploadToMicroCMS(src);
    console.log(`  🖼  画像を移しました → ${heroImageUrl}`);
  }

  const payload = {
    title,
    eyebrow: meta.eyebrow,
    lead,
    heroImage: heroImageUrl,
    heroImageAlt: title,
    body: bodyHtml,
    seoTitle: `${title} | &LAB TOKYO`,
    seoDescription: meta.seoDescription,
    ctaHeading: meta.cta.heading,
    ctaText: meta.cta.text,
    ctaLabel: meta.cta.buttonLabel,
    ctaUrl: meta.cta.buttonUrl,
  };

  await postToMicroCMS(meta.slug, payload);

  console.log(`  body: ${payload.body.length}文字  sections: ${filteredBlocks.filter(b=>b.fieldId==='section').length}件  faq: ${faqItems.length}件`);
}

// ---------------------------------------------------------------------------
// エントリポイント
// ---------------------------------------------------------------------------
const targets = SLUG_FILTER
  ? ARTICLES.filter(a => a.slug === SLUG_FILTER)
  : ARTICLES;

if (!targets.length) {
  console.error(`slug "${SLUG_FILTER}" は対象リストにありません`);
  process.exit(1);
}

console.log(`🚀 Wix → microCMS  [${DRY_RUN ? 'dry-run' : '本番投稿'}]`);

for (const meta of targets) {
  try {
    await processArticle(meta);
  } catch (e) {
    console.error(`  ❌ ${meta.slug}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 1200));
}

console.log('\n✅ 完了');
if (DRY_RUN) console.log('   確認: scripts/dry-run-*.json');
console.log('\n次のステップ:');
console.log('  1. microCMS管理画面で各記事を目視確認');
console.log('  2. 「研究」「調査」「効果」含む段落を quoteBlock に移動して出典を追記');
console.log('  3. tableBlock の内容を確認・修正');
