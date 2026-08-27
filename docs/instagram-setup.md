# Instagram 投稿をサイトに自動表示する（セットアップ手順）

Instagram Graph API（Facebook ログイン経由）で最新投稿を取得し、
`InstagramFeed` コンポーネントに並べるための設定手順。

---

## 前提

- Instagram が **プロアカウント（ビジネス or クリエイター）** であること
- その Instagram が **Facebook ページに連携** されていること
- Facebook ページの管理者であること

> Instagram Basic Display API は 2024年12月に終了済み。
> 現在は Instagram Graph API（この手順）を使う。

---

## 1. Facebook アプリを作る

1. https://developers.facebook.com → 「マイアプリ」→「アプリを作成」
2. ユースケースは **「その他」→「ビジネス」** を選ぶ
3. 作成後、「アプリの設定」→「ベーシック」で
   **アプリID** と **app secret** を控える（あとで使う）

自分のアカウントを読むだけなら App Review（アプリ審査）もビジネス認証も不要。
自分がアプリの管理者である間は標準アクセスのまま動く。

---

## 2. 短期トークンを取る

1. https://developers.facebook.com/tools/explorer
2. 右上でさっき作ったアプリを選ぶ
3. 「ユーザーまたはページ」→ **ユーザーアクセストークン**
4. 権限に次を追加する

   | 権限 | 用途 |
   |---|---|
   | `instagram_basic` | 投稿・画像・キャプションの取得（必須） |
   | `pages_show_list` | 連携ページの一覧取得（必須） |
   | `pages_read_engagement` | ページ情報の読み取り（必須） |
   | `instagram_manage_insights` | いいね数・リーチ等のインサイト（**任意**。投稿を並べるだけなら不要） |

5. 「アクセストークンを生成」→ ログインして許可

ここで出るのは **約1〜2時間しかもたない短期トークン**。次で長期化する。

---

## 3. 長期化 ＋ ID 取得（スクリプトで一括）

手動でやると「トークン延長」→「ページ一覧」→「Instagram ID 取得」と
3ステップ踏むことになるので、まとめて実行するスクリプトを用意してある。

```sh
node scripts/instagram-token.mjs \
  --app-id 1234567890 \
  --app-secret xxxxxxxxxxxxxxxx \
  --token <手順2で生成した短期トークン>
```

最後に `.env` に貼る2行がそのまま出力される。

### ⚠ ここが一番の落とし穴

アクセストークンツール（`/tools/accesstoken`）の「アクセストークンを延長」で
出てくるのは **60日で切れるユーザートークン**。無期限ではない。
2ヶ月ごとにフィードが止まる。

上のスクリプトが出す **ページアクセストークン** は、
長期ユーザートークンから派生させたもので **期限なし**。こちらを使うこと。
（パスワード変更・権限の取り消し・アプリ削除をすると無効になる）

---

## 4. 環境変数をセットする

`.env`（ローカル）と Vercel の Environment Variables の両方に登録する。

```
IG_USER_ID=17841400000000000
IG_ACCESS_TOKEN=EAAG...（150〜250文字）
```

`.env` は `.gitignore` 済み。**トークンをコミットしないこと。**
Vercel 側は Settings → Environment Variables → Production / Preview 両方に追加。

---

## 5. ページに置く

```astro
---
import InstagramFeed from '../components/InstagramFeed.astro';
---

<InstagramFeed />          <!-- 既定8件 -->
<InstagramFeed limit={12} /> <!-- 件数指定（1〜25） -->
```

---

## 動作の仕組み

```
ブラウザ → /api/instagram → Graph API → Instagram
             （トークンはここだけ）
```

- トークンはサーバー側（`api/instagram.js`）だけで扱う。フロントには出ない
- レスポンスは Vercel エッジで1時間キャッシュ（`s-maxage=3600`）
- 取得に失敗したら、コンポーネントは自動でリンクボタン表示に戻る
  → **トークンが切れてもサイトは壊れない**

---

## うまくいかないとき

| 症状 | 原因と対処 |
|---|---|
| リンクボタンのまま | 環境変数が未設定。Vercel に入れて再デプロイ |
| `Error validating access token` | トークン失効。手順2〜3をやり直す |
| ページ一覧が空 | Instagram がプロアカウントでない / FBページ未連携 |
| 画像だけ出ない | Instagram の画像URLは有効期限つき。キャッシュを短くする |
| `(#100) ... nonexisting field` | Graph API のバージョン切れ。`IG_GRAPH_VERSION` で新しい版を指定 |

---

## もっと手軽にしたい場合

このAPI連携は無料だが、アプリ作成とトークン管理が必要。
運用の手間を避けたいなら **Behold.so**（無料枠あり）でウィジェットを
貼るだけでも同じ見た目にできる。更新頻度と手間のトレードオフ。
