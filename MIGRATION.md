# &LAB TOKYO サイト移行マスター管理ファイル

Wix（andlabtokyo.com）→ Astro（andlabtokyo-new-site）全ページ移行の進捗・画像管理ファイル。
**毎セッションの作業開始前にこのファイルを確認すること。**

---

## ステータス凡例
- ✅ 完了
- 🔄 作業中
- ❌ 未着手
- ⏭️ スキップ（不要ページ）

---

## 全ページ一覧・移行ステータス

### 🏠 メインページ

| WixURL | Astroファイル | ステータス | 使用画像 | 備考 |
|--------|-------------|----------|---------|------|
| `/` | `src/pages/index.astro` | ✅ 既存 | brand-sushi.jpg, visual-table.jpg, hacco-amazake.jpg, rawfood-zucchini.jpg, prog-chocolate.jpg, story-lesson.jpg, book-cover.jpg, chie-portrait.jpg, student-oscar.jpg, student-doctor.jpg | トップページ |
| `/about` | `src/pages/about.astro` | ✅ 既存 | IMG_1237_edited, 安藤千英プロフィール写真, IMG_5133, IMG_5659, IMG_7030 | プロフィール・理念 |
| `/contact` | `src/pages/contact.astro` | ✅ 既存 | — | お問い合わせ |
| `/listofcourses` | `src/pages/listofcourses.astro` | ✅ 既存 | 857257_e9f986b7...jpg, 857257_121b4903...jpg, 857257_9af18e4c...jpg, 857257_94447466...jpg, 857257_17b989af...jpg | 講座一覧 |
| `/press-media` | `src/pages/media.astro` | ✅ 既存 | IMG_7208_edited.jpg, 安藤千英プロフィール写真_JPG.jpg | 実績・メディア ※URLが違うためリダイレクト要検討 |
| `/shop` | `src/pages/shop.astro` | ✅ 完了 | book-cover.jpg | ショップ（Amazon本+Square） |
| `/sustainability` | `src/pages/sustainability.astro` | ❌ 未着手 | — | サステナビリティ |
| `/recipe-supervision` | `src/pages/recipe-supervision.astro` | ❌ 未着手 | — | レシピ監修 |
| `/rawfood-book` | `src/pages/rawfood-book.astro` | ❌ 未着手 | book-cover.jpg | &RAW LIVING 書籍 |
| `/recipe` | `src/pages/recipe.astro` | ❌ 未着手 | — | レシピ |
| `/professional-training` | `src/pages/professional-training.astro` | ✅ 完了 | chieando_edited.jpg, IMG_6376.jpg, rawchocolate.JPG, close-up-delicious-chocolate-bar.jpg | プロ養成コース（価格情報あり） |
| `/beginner` | `src/pages/beginner.astro` | ❌ 未着手 | — | 初心者向け |
| `/experiencelessons` | `src/pages/experiencelessons.astro` | ✅ 完了 | — | 体験レッスン |
| `/andlab-team` | `src/pages/andlab-team.astro` | ❌ 未着手 | — | チーム紹介 |
| `/instructor-chie-ando` | `src/pages/instructor-chie-ando.astro` | ❌ 未着手 | 安藤千英プロフィール写真_JPG.jpg | 講師プロフィール詳細 |
| `/plating-creator` | `src/pages/plating-creator.astro` | ❌ 未着手 | — | プレーティングクリエイター |
| `/creativebooklab` | `src/pages/creativebooklab.astro` | ❌ 未着手 | — | クリエイティブブックラボ |
| `/trademark` | `src/pages/trademark.astro` | ❌ 未着手 | — | 商標情報 |
| `/tokushoho` | `src/pages/tokushoho.astro` | ✅ 既存 | — | 特商法 |

### 📚 ローフード・ナレッジ系

| WixURL | Astroファイル | ステータス | 使用画像 | 備考 |
|--------|-------------|----------|---------|------|
| `/rawfood` | `src/pages/rawfood.astro` | ✅ 既存 | rawfood-zucchini.jpg | ローフードとは |
| `/livingfood` | `src/pages/livingfood.astro` | ✅ 既存 | — | リビングフードとは |
| `/living-food` | `src/pages/living-food.astro` | ✅ 既存 | — | ※livingfoodと重複確認要 |
| `/knoweledge` | `src/pages/knowledge.astro` | ✅ 既存 | — | ナレッジ（Wix側typo: knoweledge） |
| `/upcycledfood` | `src/pages/upcycledfood.astro` | ❌ 未着手 | — | アップサイクルフード |
| `/spirulina` | `src/pages/spirulina.astro` | ✅ 既存 | — | スピルリナ |
| `/supirurinalab` | `src/pages/supirurinalab.astro` | ❌ 未着手 | — | ※spirulinaと内容重複確認要 |

### 🍫 Raw Chocolatier系

| WixURL | Astroファイル | ステータス | 使用画像 | 備考 |
|--------|-------------|----------|---------|------|
| `/rawchocolatier` | `src/pages/rawchocolatier/index.astro` | ✅ 既存 | 857257_32ed8175...png, IMG_2790_JPG.jpg, Chocolate Bonbons_edited.jpg | 協会トップ |
| `/rawchocolatier/rawchocolate` | `src/pages/rawchocolatier/rawchocolate.astro` | ✅ 既存 | — | ローチョコレートとは |
| `/rawchocolatier/whatrawsweets` | `src/pages/rawchocolatier/whatrawsweets.astro` | ✅ 既存 | — | ローお菓子とは |
| `/rawchocolatier/rawchocolatemeister` | `src/pages/rawchocolatier/rawchocolatemeister.astro` | ✅ 完了 | — | ローチョコマイスター |
| `/rawchocolatier/rawpatissier` | `src/pages/rawchocolatier/rawpatissier.astro` | ❌ 未着手 | — | ローパティシエ |
| `/rawchocolatier/rawchocolatier-course` | `src/pages/rawchocolatier/rawchocolatier-course.astro` | ❌ 未着手 | — | ローショコラティエコース |
| `/rawchocolatier/kidsveganpatissier` | `src/pages/rawchocolatier/kidsveganpatissier.astro` | ❌ 未着手 | 857257_8dd13346...png | キッズヴィーガンパティシエ |
| `/rawchocolatier/rawchocolatier-online-beginner` | `src/pages/rawchocolatier/rawchocolatier-online-beginner.astro` | ❌ 未着手 | — | オンライン初級 |
| `/rawchocolatier/rawchocolatier-online-intermediate` | `src/pages/rawchocolatier/rawchocolatier-online-intermediate.astro` | ❌ 未着手 | — | オンライン中級 |
| `/rawchocolatier/rawchocolatier-online-advanced` | `src/pages/rawchocolatier/rawchocolatier-online-advanced.astro` | ❌ 未着手 | — | オンライン上級 |
| `/rawchocolatier/rawpatissier-online-beginner` | `src/pages/rawchocolatier/rawpatissier-online-beginner.astro` | ❌ 未着手 | — | ローパティシエオンライン初級 |
| `/rawchocolatier/online-lesson` | `src/pages/rawchocolatier/online-lesson.astro` | ❌ 未着手 | — | オンラインレッスン |
| `/rawchocolatier/rawchocolateconcierge` | `src/pages/rawchocolatier/rawchocolateconcierge.astro` | ❌ 未着手 | — | ローチョココンシェルジュ |
| `/rawchocolatier/nutfreerawsweets` | `src/pages/rawchocolatier/nutfreerawsweets.astro` | ❌ 未着手 | — | ナッツフリーローお菓子 |
| `/rawchocolatier/15min-chocolate` | `src/pages/rawchocolatier/15min-chocolate.astro` | ❌ 未着手 | — | 15分チョコレート |
| `/rawchocolatier/rawsweets-application` | `src/pages/rawchocolatier/rawsweets-application.astro` | ❌ 未着手 | — | ローお菓子申込 |
| `/rawchocolatier/faq` | `src/pages/rawchocolatier/faq.astro` | ❌ 未着手 | — | FAQ |
| `/rawchocolatier/information` | `src/pages/rawchocolatier/information.astro` | ❌ 未着手 | — | インフォメーション |
| `/rawchocolatier/rawchocolatieraboutchocolatierchocolatierassociation` | `src/pages/rawchocolatier/about-association.astro` | ❌ 未着手 | — | 協会について（URLをリネーム推奨） |

### 🍶 発酵系

| WixURL | Astroファイル | ステータス | 使用画像 | 備考 |
|--------|-------------|----------|---------|------|
| `/fermentation` | `src/pages/fermentation.astro` | ✅ 既存 | hacco-amazake.jpg | 発酵プランナー |
| `/fermentedfood` | `src/pages/fermentedfood.astro` | ✅ 既存 | — | 発酵食品とは |
| `/fermentation/cacao-miso` | `src/pages/fermentation/cacao-miso.astro` | ❌ 未着手 | — | カカオ味噌 |
| `/koji-fermentation-experience-tokyo` | `src/pages/koji-fermentation-experience-tokyo.astro` | ✅ 既存 | — | 麹発酵体験 |
| `/trial-fermentation` | `src/pages/trial-fermentation.astro` | ❌ 未着手 | — | 発酵トライアルレッスン |
| `/hacco` | `src/pages/hacco.astro` | ✅ 既存 | hacco-amazake.jpg | Hacco LAB（Wixにはないかも） |
| `/supirurinalab` | `src/pages/supirurinalab.astro` | ❌ 未着手 | — | スピルリナラボ |

### 🥗 ローフード資格系

| WixURL | Astroファイル | ステータス | 使用画像 | 備考 |
|--------|-------------|----------|---------|------|
| `/rawfood-kentei-meister` | `src/pages/rawfood-kentei-meister.astro` | ✅ 既存 | — | ローフード検定マイスター |
| `/rawfood-kentei-meister/jlba-advance` | `src/pages/rawfood-kentei-meister/jlba-advance.astro` | ❌ 未着手 | — | JLBAアドバンス |
| `/raw-sweets` | `src/pages/raw-sweets.astro` | ✅ 既存 | — | ローお菓子（既存） |

### ⏭️ スキップ対象ページ（Wix内部・不要）

| WixURL | 理由 |
|--------|------|
| `/members` | 会員ログイン専用（Wix機能） |
| `/payment-request-page` | Wix決済ページ（Square移行） |
| `/lesson-reserve` | Wix予約システム（別途設定） |
| `/blank-1`, `/blank-2` | 空ページ |
| `/複製-トライアルレッスン-発酵` | Wix内部複製ページ |
| `/abouthummingtree` | 要確認（旧サービス名の可能性） |
| `/inquiry-services-page` | contactに統合 |
| `/item` | 要確認 |

---

## 📦 画像管理

### 現在 `public/` にある画像
```
logo-wide.png          → ナビ・フッター
brand-sushi.jpg        → Hero背景
hacco-amazake.jpg      → Hacco LABカード
rawfood-zucchini.jpg   → ローフードカード
prog-chocolate.jpg     → ローチョコカード
story-lesson.jpg       → My Story
visual-table.jpg       → ブランドビジュアル
book-cover.jpg         → 書籍
chie-portrait.jpg      → 受講生カード
student-oscar.jpg      → 受講生オスカー
student-doctor.jpg     → 吉田医師
```

### Wixで使われているがまだ取り込んでいない画像（要ダウンロード）
```
安藤千英プロフィール写真_JPG.jpg  → about, press-media, instructor
IMG_7208_edited.jpg              → press-media バナー
IMG_6376.jpg                     → professional-training
rawchocolate.JPG                 → professional-training
close-up-delicious-chocolate-bar.jpg → professional-training
chieando_edited_edited.jpg       → professional-training
857257_8dd133468d284e4d92e1068c6322d704~mv2.png → kidsveganpatissier
IMG_2790_JPG.jpg                 → rawchocolatier top
Chocolate Bonbons_edited.jpg     → rawchocolatier top
```
※ Wixの画像URL（857257_xxx形式）はWixのCDNにあるため、移行前にダウンロードして public/ に保存する必要あり。

---

## 🗓️ 作業優先順位

### Phase 1（最優先・集客に直結）
1. ❌ `/professional-training` → プロ養成（価格・資格情報）
2. ❌ `/experiencelessons` → 体験レッスン（入口ページ）
3. ❌ `/rawchocolatier/rawchocolatemeister` → 看板講座
4. ❌ `/rawchocolatier/rawpatissier` → 看板講座
5. ❌ `/rawchocolatier/rawchocolatier-course` → 看板講座
6. ❌ `/shop` → 書籍販売

### Phase 2（SEO・ブランド強化）
7. ❌ `/instructor-chie-ando` → 講師詳細
8. ❌ `/rawfood-book` → 書籍ページ
9. ❌ `/sustainability` → ブランド訴求
10. ❌ `/fermentation/cacao-miso` → SEO記事

### Phase 3（補完ページ）
- rawchocolatier/のサブページ群（online系・faq・information等）
- `/upcycledfood` `/creativebooklab` `/plating-creator`
- `/rawfood-kentei-meister/jlba-advance`

---

## 📝 セッションログ

| 日付 | 作業内容 | 担当 |
|------|---------|------|
| 2026-06-09 | MIGRATION.md作成・全58ページ一覧化・優先順位設定 | Claude |

---

*最終更新：2026-06-09 by Claude*
