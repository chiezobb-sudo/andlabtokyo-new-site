#!/usr/bin/env python3
"""
Wix ブログ記事を取り込む（URL 完全維持版）

旧 scripts/import-wix-blog.py の問題を2つ直してある:
  1. スラッグを Wix のまま .md ファイル名にする
     → /post/<slug> が Wix と一字一句同じURLで解決する
  2. 画像を public/images/wix/ にダウンロードして参照する
     旧版の get_clean_image_url() は https://static.wixstatic.com/media/<name>.<ext>
     という形に削っていたが、この形式は Wix 本番でも 403 になる（＝壊れた参照を量産していた）

使い方: python3 scripts/import-wix-posts-keep-slug.py <slug> [<slug> ...]
"""
import hashlib, html as htmlmod, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT  = os.path.join(ROOT, 'src/content/blog')
IMGD = os.path.join(ROOT, 'public/images/wix')
UA   = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0 Safari/537.36',
        'Referer': 'https://www.andlabtokyo.com/'}
os.makedirs(OUT, exist_ok=True); os.makedirs(IMGD, exist_ok=True)

def get(url, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(
        urllib.parse.quote(url, safe=':/?=&%#~'), headers=UA), timeout=45)
    d = r.read()
    return d if binary else d.decode('utf-8', 'ignore')

def og(h, p):
    m = re.search(rf'property="og:{p}"[^>]*content="([^"]*)"', h)
    return htmlmod.unescape(m.group(1)) if m else None

def save_image(url):
    """Wix CDN 画像をローカルへ。失敗したら None（壊れた参照を残さない）"""
    try:
        data = get(url, binary=True)
        if len(data) < 200: return None
    except Exception:
        return None
    base = urllib.parse.unquote(urllib.parse.urlparse(url).path.split('/')[-1]).replace('~mv2', '')
    stem, ext = os.path.splitext(base)
    stem = re.sub(r'[^A-Za-z0-9._\-]+', '-', stem).strip('-')[:60] or 'img'
    name = f'{stem}-{hashlib.sha1(url.encode()).hexdigest()[:8]}{ext.lower() or ".jpg"}'
    open(os.path.join(IMGD, name), 'wb').write(data)
    return '/images/wix/' + name

def body_markdown(h):
    m = (re.search(r'<div[^>]*data-hook="post-description"[^>]*>(.*?)</div>\s*</div>', h, re.DOTALL)
         or re.search(r'<article[^>]*>(.*?)</article>', h, re.DOTALL))
    if not m: return '', []
    block = m.group(1)
    imgs = []
    for u in dict.fromkeys(re.findall(r'<img[^>]+src="(https://static\.wixstatic\.com/[^"]+)"', block)):
        local = save_image(htmlmod.unescape(u))
        if local: imgs.append(local)
    out = []
    for p in re.findall(r'<p[^>]*>(.*?)</p>', block, re.DOTALL):
        p = re.sub(r'<br\s*/?>', '\n', p)
        t = htmlmod.unescape(re.sub(r'<[^>]+>', '', p))
        t = t.replace('​', '').replace('\xa0', ' ')
        t = '\n'.join(l.rstrip() for l in t.split('\n'))
        t = re.sub(r'\n{3,}', '\n\n', t).strip()
        if t: out.append(t)
    return '\n\n'.join(out), imgs

def category(title, body):
    s = (title + body[:200]).lower()
    if any(w in s for w in ['レシピ','サラダ','スープ','パスタ','カレー','ケーキ','チョコ','raw','ロー','漬け','マリネ','ツナ','保存']): return 'レシピ'
    if any(w in s for w in ['講座','スタート','クラス','コース','スクール','コンテスト','アワード','対応','リニューアル']): return 'お知らせ'
    if any(w in s for w in ['発酵','スピルリナ','麹','ローフード','sdgs']): return 'ナレッジ'
    return 'ブログ'

def run(slug):
    path = os.path.join(OUT, slug + '.md')
    if os.path.exists(path):
        print(f'  スキップ（既存）: {slug}'); return
    h = get(f'https://www.andlabtokyo.com/post/{slug}')
    title = (og(h, 'title') or slug).replace(' | &LAB TOKYO', '').strip()
    desc  = (og(h, 'description') or '').replace('\n', ' ').strip()
    dm = re.search(r'"datePublished"\s*:\s*"([^"]+)"', h)
    date = dm.group(1)[:10] if dm else '2020-01-01'
    hero = save_image(og(h, 'image')) if og(h, 'image') else None
    body, imgs = body_markdown(h)
    fm  = ['---', f'title: "{title.replace(chr(34), chr(39))}"']
    if desc: fm.append(f'description: "{desc[:160].replace(chr(34), chr(39))}"')
    fm.append(f'date: "{date}"')
    if hero: fm.append(f'image: "{hero}"')
    fm += [f'category: "{category(title, body)}"', '---', '']
    md = '\n'.join(fm) + (body or f'<!-- 本文が抽出できず。https://www.andlabtokyo.com/post/{slug} を参照 -->') + '\n'
    for i in imgs:
        if i != hero: md += f'\n![]({i})\n'
    open(path, 'w', encoding='utf-8').write(md)
    print(f'  ✅ {slug}\n       {title} / {date} / 本文{len(body)}字 / 画像{len(imgs) + (1 if hero else 0)}点')

if __name__ == '__main__':
    for s in sys.argv[1:]:
        try: run(s)
        except Exception as e: print(f'  🔴 {s}: {e}')
