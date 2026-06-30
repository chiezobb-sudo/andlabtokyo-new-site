#!/usr/bin/env python3
"""
Wixの固定ページからコンテンツ（テキスト・画像URL）を一括抽出するスクリプト
出力先: scripts/extracted-pages/ (JSON + Markdown)
使い方: python3 scripts/extract-wix-pages.py
"""

import urllib.request
from urllib.parse import quote, urlparse, unquote
import re
import os
import json
import time

SCRIPT_DIR = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'extracted-pages')
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGES = [
    # コア
    "https://www.andlabtokyo.com/",
    "https://www.andlabtokyo.com/about",
    "https://www.andlabtokyo.com/instructor-chie-ando",
    "https://www.andlabtokyo.com/andlab-team",
    "https://www.andlabtokyo.com/contact",
    "https://www.andlabtokyo.com/shop",
    "https://www.andlabtokyo.com/recipe",
    "https://www.andlabtokyo.com/recipe-supervision",
    "https://www.andlabtokyo.com/press-media",
    "https://www.andlabtokyo.com/trademark",
    "https://www.andlabtokyo.com/sustainability",
    "https://www.andlabtokyo.com/plating-creator",
    "https://www.andlabtokyo.com/creativebooklab",
    "https://www.andlabtokyo.com/rawfood-book",
    "https://www.andlabtokyo.com/upcycledfood",
    "https://www.andlabtokyo.com/knoweledge",
    # レッスン系
    "https://www.andlabtokyo.com/listofcourses",
    "https://www.andlabtokyo.com/beginner",
    "https://www.andlabtokyo.com/professional-training",
    "https://www.andlabtokyo.com/experiencelessons",
    "https://www.andlabtokyo.com/trial-fermentation",
    "https://www.andlabtokyo.com/koji-fermentation-experience-tokyo",
    # 発酵
    "https://www.andlabtokyo.com/fermentation",
    "https://www.andlabtokyo.com/fermentedfood",
    "https://www.andlabtokyo.com/fermentation/cacao-miso",
    # ローフード
    "https://www.andlabtokyo.com/rawfood",
    "https://www.andlabtokyo.com/livingfood",
    # ローチョコレート
    "https://www.andlabtokyo.com/rawchocolatier",
    "https://www.andlabtokyo.com/rawchocolatier/information",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolate",
    "https://www.andlabtokyo.com/rawchocolatier/faq",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatier-course",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatemeister",
    "https://www.andlabtokyo.com/rawchocolatier/rawpatissier",
    "https://www.andlabtokyo.com/rawchocolatier/rawpatissier-online-beginner",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatier-online-beginner",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatier-online-intermediate",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatier-online-advanced",
    "https://www.andlabtokyo.com/rawchocolatier/nutfreerawsweets",
    "https://www.andlabtokyo.com/rawchocolatier/whatrawsweets",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolateconcierge",
    "https://www.andlabtokyo.com/rawchocolatier/kidsveganpatissier",
    "https://www.andlabtokyo.com/rawchocolatier/15min-chocolate",
    "https://www.andlabtokyo.com/rawchocolatier/online-lesson",
    "https://www.andlabtokyo.com/rawchocolatier/rawchocolatieraboutchocolatierchocolatierassociation",
    "https://www.andlabtokyo.com/rawchocolatier/rawsweets-application",
    # ローフード検定
    "https://www.andlabtokyo.com/rawfood-kentei-meister",
    "https://www.andlabtokyo.com/rawfood-kentei-meister/jlba-advance",
    # スピルリナ
    "https://www.andlabtokyo.com/spirulina",
    "https://www.andlabtokyo.com/supirurinalab",
]

def fetch_html(url):
    encoded = quote(url, safe=':/?=&%#~/')
    req = urllib.request.Request(encoded, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
    })
    r = urllib.request.urlopen(req, timeout=20)
    return r.read().decode('utf-8', errors='ignore')

def extract_og(html, prop):
    m = re.search(rf'property="og:{prop}"[^>]*content="([^"]*)"', html)
    if not m:
        m = re.search(rf'content="([^"]*)"[^>]*property="og:{prop}"', html)
    return m.group(1).strip() if m else ''

def clean_text(html_frag):
    text = re.sub(r'<[^>]+>', ' ', html_frag)
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>') \
               .replace('&nbsp;', ' ').replace('&#39;', "'").replace('&quot;', '"')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_all_text(html):
    """h1〜h3 + p タグからテキストを段落単位で取得"""
    sections = []

    # h1/h2/h3 見出し
    for m in re.finditer(r'<(h[1-3])[^>]*>(.*?)</\1>', html, re.DOTALL | re.I):
        tag, content = m.group(1).lower(), m.group(2)
        text = clean_text(content)
        if text and len(text) > 1:
            prefix = '#' * int(tag[1])
            sections.append(f"{prefix} {text}")

    # p 段落
    for m in re.finditer(r'<p[^>]*>(.*?)</p>', html, re.DOTALL | re.I):
        text = clean_text(m.group(1))
        if text and len(text) > 5:
            sections.append(text)

    # li アイテム（箇条書き）
    for m in re.finditer(r'<li[^>]*>(.*?)</li>', html, re.DOTALL | re.I):
        text = clean_text(m.group(1))
        if text and len(text) > 3:
            sections.append(f"- {text}")

    # 重複除去しながら順序保持
    seen = set()
    deduped = []
    for s in sections:
        if s not in seen:
            seen.add(s)
            deduped.append(s)

    return deduped

def extract_images(html, page_url):
    """Wixstatic の画像URLを全収集（重複なし、シンプルURL）"""
    raw_urls = re.findall(
        r'https://static\.wixstatic\.com/media/[a-zA-Z0-9_]+\.[a-zA-Z]{2,5}',
        html
    )
    # og:image も追加
    og_img = extract_og(html, 'image')
    if og_img:
        m = re.match(r'(https://static\.wixstatic\.com/media/[a-zA-Z0-9_]+\.[a-zA-Z]{2,5})', og_img)
        if m:
            raw_urls.insert(0, m.group(1))

    seen = set()
    unique = []
    for u in raw_urls:
        if u not in seen:
            seen.add(u)
            unique.append(u)
    return unique

def url_to_slug(url):
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    return path.replace('/', '__') if path else 'home'

def process_page(url):
    slug = url_to_slug(url)
    json_path = os.path.join(OUTPUT_DIR, f'{slug}.json')
    md_path   = os.path.join(OUTPUT_DIR, f'{slug}.md')

    if os.path.exists(json_path):
        print(f"  スキップ（既存）: {slug}")
        return True

    try:
        html = fetch_html(url)

        title       = extract_og(html, 'title') or slug
        title       = re.sub(r'\s*[|｜]\s*&LAB.*$', '', title).strip()
        description = extract_og(html, 'description')
        og_image    = extract_og(html, 'image')
        og_image_clean = ''
        if og_image:
            m = re.match(r'(https://static\.wixstatic\.com/media/[a-zA-Z0-9_]+\.[a-zA-Z]{2,5})', og_image)
            og_image_clean = m.group(1) if m else og_image

        texts  = extract_all_text(html)
        images = extract_images(html, url)

        data = {
            "url": url,
            "slug": slug,
            "title": title,
            "description": description,
            "og_image": og_image_clean,
            "images": images,
            "text_blocks": texts,
        }

        # JSON保存
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # Markdownプレビュー保存
        md_lines = [
            f'# {title}',
            f'**URL:** {url}',
            f'**説明:** {description}' if description else '',
            f'**OG画像:** {og_image_clean}' if og_image_clean else '',
            '',
            '## テキスト',
            '',
        ]
        md_lines += texts
        md_lines += ['', '## 画像URL一覧', '']
        md_lines += [f'- {img}' for img in images]

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(line for line in md_lines if line is not None))

        print(f"  ✅ {slug}  ({len(texts)}テキスト / {len(images)}画像)")
        return True

    except Exception as e:
        print(f"  ❌ {slug} → {e}")
        return False

if __name__ == '__main__':
    print(f"Wix固定ページを {OUTPUT_DIR} に抽出します...\n")
    print(f"対象: {len(PAGES)}ページ\n")
    ok = 0
    for i, url in enumerate(PAGES, 1):
        print(f"[{i:2}/{len(PAGES)}] ", end='', flush=True)
        if process_page(url):
            ok += 1
        time.sleep(1.0)

    print(f"\n完了: {ok}/{len(PAGES)} ページを抽出しました")
    print(f"出力先: {OUTPUT_DIR}")
    print(f"\n=== ファイル一覧 ===")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith('.json'):
            path = os.path.join(OUTPUT_DIR, f)
            size = os.path.getsize(path)
            print(f"  {f}  ({size:,} bytes)")
