#!/usr/bin/env python3
"""
Wixブログ記事を自動抽出してMarkdownファイルに変換するスクリプト
使い方: python3 scripts/import-wix-blog.py
"""

import urllib.request
from urllib.parse import quote, urlparse, unquote
import re
import os
import time

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../src/content/blog')
os.makedirs(OUTPUT_DIR, exist_ok=True)

BLOG_URLS = [
    "https://www.andlabtokyo.com/post/コスメスイーツプレゼントキャンペーン",
    "https://www.andlabtokyo.com/post/白ゴーヤのレモンオイルサラダ",
    "https://www.andlabtokyo.com/post/簡単タイ風カレー",
    "https://www.andlabtokyo.com/post/ローチョコレートマイスター講座スタート",
    "https://www.andlabtokyo.com/post/塩麹で仕上げるソイミートパスタ",
    "https://www.andlabtokyo.com/post/with19",
    "https://www.andlabtokyo.com/post/vegeaward2020",
    "https://www.andlabtokyo.com/post/tokyostep3",
    "https://www.andlabtokyo.com/post/ローハニーナッツ",
    "https://www.andlabtokyo.com/post/スピルリナlabスタート！",
    "https://www.andlabtokyo.com/post/4種のヴィーガンマフィン",
    "https://www.andlabtokyo.com/post/rawラーメン（ベジとんこつラーメン）",
    "https://www.andlabtokyo.com/post/ふきのとうみそ（ばっけみそ）",
    "https://www.andlabtokyo.com/post/ブレンテック日本公式ライブコマースに出演",
    "https://www.andlabtokyo.com/post/ピンクパスタ",
    "https://www.andlabtokyo.com/post/fermented-hot-sauce",
    "https://www.andlabtokyo.com/post/紫のポタージュ",
    "https://www.andlabtokyo.com/post/toubanjyan",
    "https://www.andlabtokyo.com/post/ピーチガスパチョ",
    "https://www.andlabtokyo.com/post/バーニャカウダソース",
    "https://www.andlabtokyo.com/post/ローフィグケーキ-1",
    "https://www.andlabtokyo.com/post/まん丸焼リンゴ",
    "https://www.andlabtokyo.com/post/アスパラガスのハーブマリネ",
    "https://www.andlabtokyo.com/post/はまぐりの塩バターレモンクリームスープ",
    "https://www.andlabtokyo.com/post/ルウから作るスパイスカレー",
    "https://www.andlabtokyo.com/post/fermentation-rawfood-livingfood",
    "https://www.andlabtokyo.com/post/smartlife",
    "https://www.andlabtokyo.com/post/rawsweetsplanneradvanceclass",
    "https://www.andlabtokyo.com/post/shiso",
    "https://www.andlabtokyo.com/post/柿酢でらっきょう漬け",
    "https://www.andlabtokyo.com/post/ホットアップルタイザー",
    "https://www.andlabtokyo.com/post/韓国風raw焼きそば",
    "https://www.andlabtokyo.com/post/そのまんまアボカドバーガー~ビーツの大豆ミートハンバーグ入り",
    "https://www.andlabtokyo.com/post/トマトと麹の簡単マリネ",
    "https://www.andlabtokyo.com/post/ギルトフリーrawチョコレートケーキ",
    "https://www.andlabtokyo.com/post/パプリカのオレンジスムージードレッシング",
    "https://www.andlabtokyo.com/post/アーユルヴェーダスパイスカレーとギーのレシピ",
    "https://www.andlabtokyo.com/post/インデラカレーでビーガンカレー！",
    "https://www.andlabtokyo.com/post/出版記念パーティーで感じた感謝と新たな挑戦",
    "https://www.andlabtokyo.com/post/ギーの作り方",
    "https://www.andlabtokyo.com/post/raw冷やし中華",
    "https://www.andlabtokyo.com/post/冬のなます、甘麹仕立て",
    "https://www.andlabtokyo.com/post/rawfooditem",
    "https://www.andlabtokyo.com/post/日向夏の手毬寿司",
    "https://www.andlabtokyo.com/post/フラワーガーデン・サラダ",
    "https://www.andlabtokyo.com/post/raw-chocolatier-ローショコラティエ商標登録",
    "https://www.andlabtokyo.com/post/rawsweetsplannerbeginnerclass",
    "https://www.andlabtokyo.com/post/rawmeisterchocolatemeister",
    "https://www.andlabtokyo.com/post/ビーツのピンクスープ",
    "https://www.andlabtokyo.com/post/フリーカのサラダ",
    "https://www.andlabtokyo.com/post/アボカドと豆腐のサラダ",
    "https://www.andlabtokyo.com/post/塩こうじで仕上げるキヌアサラダ",
    "https://www.andlabtokyo.com/post/発酵ハバネロソース",
    "https://www.andlabtokyo.com/post/金柑としょうがのスパイスメイプルシロップ漬け",
    "https://www.andlabtokyo.com/post/spilulinalab7",
    "https://www.andlabtokyo.com/post/塩麹ベジチャーハン",
    "https://www.andlabtokyo.com/post/ando-chie-fox",
    "https://www.andlabtokyo.com/post/きびめんでグレープフルーツパスタ",
    "https://www.andlabtokyo.com/post/ワイルドライスのグレインズサラダ",
    "https://www.andlabtokyo.com/post/fermented-foods-top5-gut-health-tokyo",
    "https://www.andlabtokyo.com/post/aboutrawfood1",
    "https://www.andlabtokyo.com/post/ヌテラ風rawヘーゼルナッツクリーム",
    "https://www.andlabtokyo.com/post/onlinelessonstart",
    "https://www.andlabtokyo.com/post/spirulinalabseika",
    "https://www.andlabtokyo.com/post/ラムチョップdeショコラ-ゆずこしょう添え",
    "https://www.andlabtokyo.com/post/美腸薬膳ひよこ豆のカレー",
]

def fetch_html(url):
    encoded = quote(url, safe=':/?=&%#~')
    req = urllib.request.Request(encoded, headers={"User-Agent": "Mozilla/5.0"})
    r = urllib.request.urlopen(req, timeout=15)
    return r.read().decode('utf-8', errors='ignore')

def extract_og(html, prop):
    m = re.search(rf'property="og:{prop}"[^>]*content="([^"]*)"', html)
    if not m:
        m = re.search(rf'name="og:{prop}"[^>]*content="([^"]*)"', html)
    return m.group(1) if m else None

def extract_date(html):
    patterns = [
        r'"datePublished"\s*:\s*"([^"]+)"',
        r'<time[^>]*datetime="([^"T]+)',
        r'"uploadDate"\s*:\s*"([^"]+)"',
    ]
    for p in patterns:
        m = re.search(p, html)
        if m:
            return m.group(1)[:10]
    return "2024-01-01"

def extract_body_text(html):
    # Wixのブログ本文エリアを抽出
    body_match = re.search(
        r'<div[^>]*data-hook="post-description"[^>]*>(.*?)</div>\s*</div>',
        html, re.DOTALL
    )
    if not body_match:
        body_match = re.search(
            r'<article[^>]*>(.*?)</article>',
            html, re.DOTALL
        )
    if not body_match:
        return ""

    content = body_match.group(1)

    # 段落テキスト抽出
    paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)
    lines = []
    for p in paragraphs:
        text = re.sub(r'<[^>]+>', '', p).strip()
        text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&nbsp;', ' ').replace('&#39;', "'")
        if text:
            lines.append(text)

    return '\n\n'.join(lines)

def get_clean_image_url(url):
    """Wix画像URLからパラメータを除去してシンプルなURLにする"""
    m = re.match(r'(https://static\.wixstatic\.com/media/[a-z0-9_]+\.[a-z]+)', url, re.I)
    return m.group(1) if m else url

def url_to_slug(url):
    path = urlparse(url).path
    slug = path.split('/post/')[-1]
    return slug

def sanitize_filename(slug):
    # ファイル名として使えない文字を置換
    return re.sub(r'[<>:"/\\|?*]', '-', slug)

def guess_category(title, body):
    title_lower = (title + body[:200]).lower()
    if any(w in title_lower for w in ['レシピ', 'サラダ', 'スープ', 'パスタ', 'カレー', 'ケーキ', 'チョコ', 'raw', 'ロー', '漬け', 'マリネ']):
        return 'レシピ'
    if any(w in title_lower for w in ['講座', 'スタート', 'クラス', 'コース', 'スクール']):
        return 'お知らせ'
    if any(w in title_lower for w in ['発酵', 'スピルリナ', '麹', 'ローフード']):
        return 'ナレッジ'
    return 'ブログ'

def process_url(url):
    slug = url_to_slug(url)
    filename = sanitize_filename(slug) + '.md'
    filepath = os.path.join(OUTPUT_DIR, filename)

    if os.path.exists(filepath):
        print(f"  スキップ（既存）: {slug}")
        return True

    try:
        html = fetch_html(url)

        title = extract_og(html, 'title') or slug
        title = title.replace(' | &LAB TOKYO', '').replace('&amp;', '&').strip()

        description = extract_og(html, 'description') or ''
        description = description.replace('&amp;', '&').strip()

        raw_image = extract_og(html, 'image') or ''
        image = get_clean_image_url(raw_image) if raw_image else ''

        date = extract_date(html)
        body = extract_body_text(html)
        category = guess_category(title, body)

        # Markdownファイル生成
        md = f'---\ntitle: "{title}"\n'
        if description:
            md += f'description: "{description[:160]}"\n'
        md += f'date: "{date}"\n'
        if image:
            md += f'image: "{image}"\n'
        md += f'category: "{category}"\n'
        md += '---\n\n'
        if body:
            md += body + '\n'
        else:
            md += f'<!-- TODO: {url} から本文を追記してください -->\n'

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md)

        print(f"  ✅ {slug[:50]}")
        return True

    except Exception as e:
        print(f"  ❌ {slug[:40]} → {e}")
        return False

if __name__ == '__main__':
    print(f"Wixブログ記事を {OUTPUT_DIR} に抽出します...\n")
    ok = 0
    for i, url in enumerate(BLOG_URLS, 1):
        print(f"[{i:2}/{len(BLOG_URLS)}] ", end='')
        if process_url(url):
            ok += 1
        time.sleep(0.8)  # サーバー負荷軽減

    print(f"\n完了: {ok}/{len(BLOG_URLS)} 記事を生成しました")
    print(f"出力先: {OUTPUT_DIR}")
