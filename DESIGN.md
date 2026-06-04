---
version: 1.0
name: andlab-tokyo-design-system
description: |
  &LAB TOKYO — 発酵創家 安藤千英のブランドデザインシステム。
  Appleのデザイン哲学（写真ファースト・余白・引き算）をベースに、
  発酵×ローフードの「静かな上質さ・食の生命感・東京の洗練」を表現する。
  
  目指すのは「人が丁寧に監修したブランドサイト」。
  AIテンプレのような整いすぎた印象は禁止。
  食の美しさと講師の実在感が伝わるデザインにすること。

brand:
  name: "&LAB TOKYO"
  tagline: "これからの私を、美しく「醸す」。"
  sub-tagline: "細胞からデザインする、一生モノの心と体。"
  target: "経営者・専門職・自分を更新し続けたいすべての女性"
  tone: "静かな上質さ・発酵の深み・東京の洗練・人の温度"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# カラー（暗い墨色ベース・ゴールドアクセント）
# Apple: 白ベース → &LAB: 暖かい墨色ベースに変換
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
colors:
  # 背景（真っ黒禁止。暖かい墨色・焦茶系）
  bg-base:     "#1A1715"   # メイン背景
  bg-raised:   "#1E1B19"   # セクション段差A
  bg-card:     "#24211E"   # カード・段差B
  bg-deep:     "#2A2622"   # 深いセクション

  # アクセント（ゴールドベージュ。強いオレンジ禁止）
  primary:     "#C6A15B"   # CTAボタン・アクセント
  primary-hover: "#D4B06A" # ホバー状態
  primary-muted: "#A8865A" # ボーダー・薄いアクセント
  primary-dim: "rgba(198,161,91,0.2)"  # 区切り線・背景

  # ブランドグリーン（ロゴの葉の色）
  leaf:        "#4E8A18"   # 「醸す」などキーワードのアクセント
  leaf-light:  "#6AAD22"   # ホバー

  # テキスト（薄いグレー禁止。生成り・アイボリー系）
  text-heading: "#FAF5EC"  # 見出し
  text-body:    "#F3EEE5"  # 本文（これより薄くしない）
  text-sub:     "#C0B6A8"  # サブテキスト・キャプション
  text-nav:     "#D6CFC4"  # ナビゲーション
  text-on-cta:  "#221C17"  # CTAボタン上の文字

  # 区切り
  divider:     "rgba(243,238,229,0.12)"

  # フッター
  footer-bg:   "#110E0B"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# タイポグラフィ（Noto Sans JP中心・2種類のみ）
# Apple: SF Pro → &LAB: Noto Sans JP + Cormorant Garamond
# Lightウェイト禁止。本文は400以上。
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
typography:
  # フォントファミリー（2種類のみ。増やさない）
  font-heading: "'Cormorant Garamond', 'Noto Sans JP', serif"
  font-body:    "'Noto Sans JP', sans-serif"

  hero-display:
    fontFamily: "{typography.font-body}"
    fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)"
    fontWeight: 700       # Boldで力強く
    lineHeight: 1.4
    letterSpacing: "0"
    color: "{colors.text-heading}"

  section-heading:
    fontFamily: "{typography.font-body}"
    fontSize: "clamp(1.7rem, 3vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.45
    color: "{colors.text-heading}"

  eyebrow:      # 「Raw Food」「My Story」などのラベル
    fontFamily: "{typography.font-heading}"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "4px"
    textTransform: "uppercase"
    color: "{colors.primary}"

  body:
    fontFamily: "{typography.font-body}"
    fontSize: "0.95rem"
    fontWeight: 400       # Lightは使わない
    lineHeight: 2.1
    color: "{colors.text-body}"

  body-strong:
    fontFamily: "{typography.font-body}"
    fontSize: "0.95rem"
    fontWeight: 700
    color: "{colors.text-heading}"

  nav:
    fontFamily: "{typography.font-body}"
    fontSize: "0.875rem"
    fontWeight: 500
    color: "{colors.text-nav}"

  caption:
    fontFamily: "{typography.font-body}"
    fontSize: "0.82rem"
    fontWeight: 400
    color: "{colors.text-sub}"

  quote:        # 受講生の声
    fontFamily: "{typography.font-heading}"
    fontSize: "1rem"
    fontWeight: 400
    fontStyle: "italic"
    lineHeight: 1.9

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 余白（Apple同様、贅沢に使う）
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
spacing:
  xs:      "8px"
  sm:      "16px"
  md:      "24px"
  lg:      "40px"
  xl:      "64px"
  section: "7rem"     # セクション間の余白（広め）
  hero-bottom: "7vh"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 角丸
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
rounded:
  none: "0px"
  sm:   "2px"    # ボタン・カード（角丸すぎない）
  md:   "4px"
  lg:   "6px"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# コンポーネント
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
components:
  # CTAボタン（メイン）
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-cta}"
    typography: "{typography.nav}"
    fontWeight: 700
    rounded: "{rounded.sm}"
    padding: "0.9rem 2.2rem"
    hover:
      backgroundColor: "{colors.primary-hover}"
      transform: "translateY(-2px)"
      boxShadow: "0 8px 24px rgba(198,161,91,0.25)"

  # アウトラインボタン
  button-outline:
    backgroundColor: "transparent"
    border: "1.5px solid {colors.primary}"
    textColor: "{colors.primary}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    padding: "0.9rem 2.2rem"
    hover:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.text-on-cta}"

  # ナビゲーション
  nav:
    backgroundColor: "rgba(26,23,21,0.93)"
    backdropFilter: "blur(16px)"
    height: "66px"
    borderBottom: "1px solid {colors.divider}"
    linkColor: "{colors.text-nav}"
    linkHover: "{colors.primary}"

  # プログラムカード（写真オーバーレイ）
  program-card:
    overlay: "linear-gradient(to top, rgba(26,23,21,0.9) 0%, rgba(26,23,21,0.1) 60%)"
    eyebrowColor: "{colors.primary}"
    titleColor: "{colors.text-heading}"
    bodyColor: "{colors.text-body}"
    metaColor: "{colors.primary}"

  # 受講生カード（Custifyスタイル）
  testimonial-card:
    backgroundColor: "{colors.bg-card}"
    borderTop: "2px solid rgba(198,161,91,0.35)"
    photoSize: "88px"
    photoBorderRadius: "50%"
    quoteMarkColor: "rgba(198,161,91,0.3)"
    align: "center"

  # 仕切り線
  rule:
    width: "32px"
    height: "1px"
    backgroundColor: "{colors.primary}"

  # セクションラベル（eyebrow）
  section-eyebrow:
    fontFamily: "{typography.font-heading}"
    fontSize: "0.72rem"
    letterSpacing: "4px"
    textTransform: "uppercase"
    color: "{colors.primary}"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 写真の使い方（最重要）
# Apple: 製品が主役 → &LAB: 食・発酵の美しさが主役
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
photography:
  philosophy: |
    食の美しさ・発酵の質感・食の生命感が主役。
    人物は補助として使い、食と空間の一部として見える構図を優先。
    彩りはあるが派手すぎず、ナチュラルでモダン。

  hero:
    subject: "野菜・ローフード・発酵の美しさを表現する写真"
    recommended: "brand-sushi.jpg（花寿司）"
    overlay: "グラデーションオーバーレイ必須（文字可読性のため）"
    position: "center 35%"

  programs:
    rawfood: "rawfood-zucchini.jpg（ズッキーニ麺・彩り・みずみずしさ）"
    hacco:   "hacco-amazake.jpg（甘麹の瓶・静かな発酵の美しさ）"
    chocolate: "prog-chocolate.jpg（ローチョコ）"

  story:
    subject: "人の温度感・実在感・教室の空気"
    recommended: "story-lesson.jpg（レッスン風景）"

  portrait:
    subject: "安藤千英の自然なポートレート"
    usage: "My Story・About・Testimonials のみ"
    note: "Hero主役にしない。丸抜き・不自然な切り抜き禁止"

  brand-visual:
    subject: "ブランドの美意識を象徴する大型ビジュアル"
    recommended: "brand-sushi.jpg（花寿司・全幅表示）"
    usage: "Programsセクションの後に全幅で表示"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# レイアウト
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
layout:
  max-width: "1100px"

  hero:
    type: "全画面写真 + 左下テキストオーバーレイ"
    text-position: "左下・左寄り"
    note: "左右完全対称にしない。きれいすぎる人物＋コピー配置にしない"
    cta-count: 1   # CTAは1つに絞る

  sections:
    order:
      - "Hero（食の写真）"
      - "体験レッスン概要ストリップ（短く明快に）"
      - "My Story（レッスン風景写真 + テキスト）"
      - "Programs（非均等グリッド）"
      - "ブランド大型ビジュアル（花寿司・全幅）"
      - "Credentials（書籍写真 + 実績リスト）"
      - "Testimonials（受講生の声）"
      - "Journal（ブログ）"
      - "最終CTA"

  programs-grid:
    type: "非均等グリッド"
    columns: "1.2fr 1fr 1fr"
    note: "均等3列禁止。最初のカードを大きくしてメリハリをつける"

  footer:
    backgroundColor: "{colors.footer-bg}"
    columns: "2fr 1fr 1fr"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 禁止事項（Claudeっぽさを消すルール）
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
forbidden:
  colors:
    - "薄いグレー文字（rgba白系で透明度を下げた文字）"
    - "真っ黒背景（#000000）"
    - "紫・青・ネオン系グラデーション"
    - "強いオレンジ・ブロンズCTA（#C47A3Aより濃い暖色）"

  layout:
    - "均等3列カードを複数セクションで繰り返す"
    - "セクションごとに同じパディング・同じカード・同じ構図"
    - "左右完全対称のHero（人物左 + テキスト右の定番配置）"
    - "均等分割レイアウトの多用"

  typography:
    - "Light（font-weight: 300以下）を本文・ボタン・ナビに使う"
    - "3種類以上のフォントファミリー"
    - "letterSpacingの過剰な広げすぎ"

  decoration:
    - "装飾目的のグラデーション"
    - "過剰なborderや発光表現（glow・ネオン）"
    - "抽象的すぎるコピーだけで具体情報なし"

  images:
    - "丸抜きや不自然な切り抜きのポートレート"
    - "人物をHeroの全面主役にする"
    - "すべての画像を同じ比率のカードに収める"

  contact:
    - "mailto:リンクを直接出す"
    - "メールアドレスをCTAにする"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# コピーのトーン
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
copy:
  tone: "静かで上質。情緒的だが具体情報も伝える。"
  hero-requirement: "誰のための・何の教室か・どこで受けられるかが1画面でわかる"
  forbidden:
    - "抽象に寄りすぎて具体情報がないコピー"
    - "AI生成っぽい過剰な修飾語"
  good-examples:
    - "これからの私を、美しく「醸す」。"
    - "細胞からデザインする、一生モノの心と体。"
    - "忙しさを、輝きに変える。"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 問い合わせ・予約導線
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cta:
  primary: "体験レッスンを予約する → /lessons"
  secondary: "お問い合わせフォームへ → /contact"
  note: |
    メールリンク（mailto:）を直接出さない。
    将来的な予約カレンダー連携に対応できる設計にする。
    CTAは最大2つ。主CTAを1つに絞る。

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 仕上がりイメージ
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
vision: |
  Squarespaceのような洗練感はあるが、テンプレ感ではなく
  &LAB TOKYO独自の静かな存在感があること。
  
  「高級っぽいAIサイト」ではなく
  「人が丁寧に監修したブランドサイト」に見せること。
  
  食の美しさが先に来て、その後で講師の思想と信頼が伝わる。
