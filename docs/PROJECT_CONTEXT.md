# &LAB TOKYO サイト制作 — プロジェクトコンテキスト

**作成日:** 2026-06-07  
**ステータス:** 開発進行中  
**最終更新:** 2026-06-07

---

## 🎯 プロジェクト概要

**プロジェクト名:** &LAB TOKYO 新サイト構築（Wix → Astro 移行）  
**クライアント:** 安藤千英（&LAB TOKYO 代表）  
**目的:** プレミアム・ミニマリズムデザインを採用したブランドサイト構築  
**現行サイト:** https://www.andlabtokyo.com/  
**新サイト:** https://andlabtokyo-new-site.vercel.app (プレビュー)

---

## 🛠️ 技術スタック

| 項目 | 値 |
|------|-----|
| **フレームワーク** | Astro 6.4.2 |
| **Node.js** | v22.22.3 (必須 >=22.12.0) |
| **npm** | 10.9.8 |
| **CSS** | Tailwind CSS (CDN) + インラインスタイル |
| **ホスティング** | Vercel (自動デプロイ) |
| **リポジトリ** | GitHub: `chiezobb-sudo/andlabtokyo-new-site` |
| **ドメイン** | www.andlabtokyo.com（未設定） |

---

## 📁 重要ファイル・パス

```
/Users/chie/Sites/andlabtokyo-new-site/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # ✅ マスターレイアウト（ヘッダー・フッター統一）
│   ├── pages/
│   │   ├── index.astro            # ✅ ホームページ（プレミアム・ミニマリズム）
│   │   ├── listofcourses.astro     # ✅ 講座一覧
│   │   ├── koji-fermentation-experience-tokyo.astro  # ✅
│   │   ├── rawfood-kentei-meister.astro              # ✅
│   │   ├── knowledge.astro         # ✅ ブログ・ナレッジ
│   │   ├── about.astro             # ✅ About
│   │   ├── contact.astro           # ✅ Contact
│   │   ├── brand.astro             # ✅ Brand/Concept
│   │   └── blog/                   # ✅ ブログ記事（3本）
│   └── components/
│       └── OneDaySection.astro     # ✅ 1Day体験セクション
├── public/
│   ├── logo-wide.svg               # ✅ ロゴ（高品質PNG版）
│   ├── logo-wide.png               # ✅
│   ├── herotable.JPG               # ✅ ヒーロー画像
│   ├── IMG_1203.JPG                # ✅ The Two Doors左
│   ├── IMG_1544.JPG                # ✅ The Two Doors右
│   └── favicon.ico                 # ✅（Wix URL）
├── docs/
│   ├── WIX_IMAGES_ANALYSIS.md      # ✅ 画像分析レポート（109枚）
│   ├── complete_wix_image_urls.txt # ✅ 全画像URLリスト
│   └── PROJECT_CONTEXT.md          # ← 本ドキュメント
├── astro.config.mjs                # ✅ Astro設定（siteUrl: www.andlabtokyo.com）
├── package.json
└── .github/workflows/              # ✅ Vercelの自動デプロイ設定

```

---

## 🚀 デプロイ・ホスティング

### Vercel（本番・プレビュー）
```
プロジェクト URL: https://vercel.com/chiezobb-sudo/andlabtokyo-new-site
プレビュー URL: https://andlabtokyo-new-site.vercel.app
本番 URL: www.andlabtokyo.com（設定待機中）

自動デプロイ: GitHub main ブランチへのpushで自動実行
ビルド言語: Node.js
ビルドコマンド: npm run build
プレビューコマンド: npm run preview (ローカル)
```

### ローカル開発
```bash
cd /Users/chie/Sites/andlabtokyo-new-site
source ~/.nvm/nvm.sh && nvm use 22
npm run build          # ビルド
npm run preview        # ローカルプレビュー (http://localhost:4321)
```

### GitHub
```
リポジトリ: https://github.com/chiezobb-sudo/andlabtokyo-new-site
ブランチ: main
保護ルール: あり（main へのdirect pushはレビュー必須）
```

---

## 🎨 デザイン仕様

### カラーパレット
```css
--linen:   #FAF9F6    /* メイン背景（温かみのあるオフホワイト） */
--sumi:    #1C1C1A    /* テキスト・ダークバック */
--green:   #A9D159    /* アクセントカラー */
--gold:    #D4AF37    /* プレミアム要素 */
```

### タイポグラフィ
```css
見出し: Noto Serif JP, weight 200-300, letter-spacing 0.25-0.28em
本文:   Noto Serif JP, weight 300-400, letter-spacing 0.1-0.15em
ナビ:   Noto Sans JP, size 10px, letter-spacing 0.3em
```

### グローバルレイアウト
- **ヘッダー**: 固定, 高さ 64px, 透過背景 + ブラー効果
  - ロゴ左上配置
  - ナビ右側 (ABOUT, COURSES, JOURNAL, ACCESS)
- **フッター**: ロゴ左下, 住所右下 (アシンメトリック)
- **Body padding**: `padding-top: 64px` (ヘッダー高さ分)

---

## 📊 進捗状況

### ✅ 完成した部分

| 項目 | 詳細 | 完成度 |
|------|------|--------|
| **Layout.astro** | ヘッダー・フッター統一 | 100% |
| **ホームページ** | ヒーロー + The Two Doors | 100% |
| **講座ページ群** | 全講座詳細ページ | 100% |
| **ナビゲーション** | グローバル統一 | 100% |
| **OneDaySection** | 1Day体験セクション | 100% |
| **SEO/OGP** | メタデータ・JSON-LD | 100% |
| **レスポンシブ** | モバイル対応 | 100% |
| **ビルド・デプロイ** | Vercel自動化 | 100% |
| **25ページ生成** | すべてのページ | 100% |

### 🔄 進行中

- ドメイン（www.andlabtokyo.com）設定待機

### ⏳ 今後のタスク

- [ ] **Wix画像の段階的反映** (109枚リスト済み)
  - Phase 1: ヒーロー・プロフィール (優先度HIGH)
  - Phase 2: コース・知識 (優先度MEDIUM)
  - Phase 3: ブログ・SNS (優先度LOW)
- [ ] **本番ドメイン設定** (Vercel + DNS設定)
- [ ] **SEO微調整** (Canonical URL確認、メタデータ最適化)
- [ ] **アナリティクス** (Google Analytics 設定)

---

## 📸 Wix 画像分析結果

**抽出画像:** 109枚  
**分析ドキュメント:** `docs/WIX_IMAGES_ANALYSIS.md`  
**完全URL リスト:** `docs/complete_wix_image_urls.txt`

### 高優先度画像（推奨実装）

```javascript
// ヒーロー画像
HOME_HERO: "857257_2f8d5c79f12f4e9593729e0260b5c3a6"
KOJI_HERO: "857257_8fddc85939c749f8ba4892cfa56de3c6"

// 講座画像
RAWFOOD:    "857257_00fcccc08c1d4a6bb78aadbb4ed6643c"
FERMENT:    "857257_0173fefcc068487aa0977c6d825dba1b"
CHOCOLATIER: "857257_142c86f0ed2a4006b707842a98e83c84"

// プロフィール
CHIE:       "857257_6a244d3ac66044b9a091293c8e91cd03"
STUDIO:     "857257_8dd81307d4434463ab839734e333dea7"
```

---

## 🔑 重要な実装メモ

### ✨ ヒーロー セクション（index.astro）
- **グラデーションオーバーレイ**: 背景 #FAF9F6 → transparent（左30-40%）
- **画像配置**: absolute right-0, width 80%
- **テキスト**: Noto Serif JP weight 200, letter-spacing 0.28em
- **スクロールインジケーター**: 細い縦線 (opacity 0.35)

### The Two Doors
- 左: IMG_1203.JPG (PROFESSIONAL COURSES)
- 右: IMG_1544.JPG (TRADITIONAL KOJI WORKSHOPS)
- オーバーレイテキスト（大きい数字 01, 02）
- 右側に縦書きテキスト: 「学ぶことは、未来の美しさをつくること。」

### OneDaySection
- ゴールド枠線: rgba(212, 175, 55, 0.3)
- Subtle shadow: 0 20px 50px rgba(0,0,0,0.02)
- タイトル: "Invitation"
- 価格: ¥13,000

---

## 📋 次回セッション開始時のチェックリスト

- [ ] Node.js v22 が使用可能か確認 (`nvm use 22`)
- [ ] Vercel 最新ビルドステータスを確認
- [ ] `docs/WIX_IMAGES_ANALYSIS.md` で画像マッピングを確認
- [ ] GitHub main ブランチが最新か確認
- [ ] ローカルプレビュー起動: `npm run preview`

---

## 🔗 リンク集

| 項目 | URL |
|------|-----|
| **GitHub リポジトリ** | https://github.com/chiezobb-sudo/andlabtokyo-new-site |
| **Vercel プロジェクト** | https://vercel.com/chiezobb-sudo/andlabtokyo-new-site |
| **プレビュー URL** | https://andlabtokyo-new-site.vercel.app |
| **本番 URL（未設定）** | www.andlabtokyo.com |
| **現行 Wix サイト** | https://www.andlabtokyo.com/ |

---

## 👤 クライアント情報

**名前:** 安藤千英  
**会社:** &LAB TOKYO  
**メール:** chiezobb@gmail.com  
**ブランド:** 発酵 × ローフード × プレミアム教育  

---

**ドキュメント作成者:** Claude Haiku 4.5  
**最終更新:** 2026-06-07 17:30 UTC
