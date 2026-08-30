/**
 * サイト内の全フォームの送信先を、ここ 1 箇所で決める。
 *
 * 経緯（2026-08-30）:
 *   移行前の状態では、サイト上のフォームが 1 つも動いていなかった。
 *     - contact.astro          -> https://formspree.io/f/contact   （IDがダミー・400）
 *     - rawfood.astro          -> https://formspree.io/f/REPLACE_ID（置換忘れ）
 *     - rawsweets-application  -> data-netlify="true"（Netlify用。本番はVercelなので無効）
 *     - rawfood-kentei-meister -> action="/contact"（静的ページへPOST。何も起きない）
 *   このまま .com を切り替えると、問い合わせも申込も黙って消える。
 *
 * 使い方:
 *   1. フォーム受信サービス（Formspree 等）でフォームを作る
 *   2. .env と Vercel の環境変数に PUBLIC_FORM_ENDPOINT を設定する
 *        PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
 *   3. 以上。全フォームが一斉に有効になる
 *
 * 未設定のあいだは isFormLive が false になり、各ページは
 * 「動かないフォーム」ではなくメール導線を出す（送信を握りつぶさないため）。
 */

export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

/** 送信先が設定済みか。false のときフォームを出してはいけない。 */
export const isFormLive: boolean = /^https?:\/\//.test(FORM_ENDPOINT);

/** 申し込み・問い合わせの受け先メール */
export const CONTACT_EMAIL = 'info@andlabtokyo.com';

/** 件名つき mailto を作る（フォーム未設定時のフォールバック導線） */
export function mailtoFor(subject: string, body = ''): string {
  const q = new URLSearchParams({ subject });
  if (body) q.set('body', body);
  return `mailto:${CONTACT_EMAIL}?${q.toString().replace(/\+/g, '%20')}`;
}
