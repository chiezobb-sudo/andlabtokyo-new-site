/**
 * Tally のフォームID一覧。
 *
 * なぜ Tally か（2026-09-05 Chie と確認）:
 *   - ページ内に直接埋め込める（LPのようにその場で書き込める）
 *   - 講座が変わったとき、Chie が Tally の画面で項目を直せる。開発を待たなくていい
 *   - 受講条件などの条件分岐が使える（マイスターのフォームで既に使用）
 *   - 無料プランで回答数は無制限
 *
 * 追加のしかた:
 *   Tally でフォームを作る → URL の tally.so/r/XXXXXX の XXXXXX をここに1行足す。
 *   ページ側は <FormGate tally={TALLY.〇〇} ...> と渡すだけ。
 *
 * 注意（2026-08-19 の事故）:
 *   ローチョコレートマイスターのページには Tally が埋め込まれていたが、
 *   ページを microCMS 版に作り替えたときに引き継がれず、2か月間
 *   申し込み導線が消えていた（Tally 側の回答数 0 件がその証拠）。
 *   ページを作り替えるときは、必ずここを見て埋め込みが残っているか確認すること。
 */
export const TALLY = {
  /** ローチョコレートマイスター養成講座 お申し込みフォーム（受講条件の分岐あり） */
  rawchocolatemeister: 'ODgokM',
  /** &LAB TOKYO 10周年｜あなたの声を聞かせてください */
  tenth: '689yRo',
} as const;

/** microCMS の講座ID → Tally フォームID */
export const TALLY_BY_COURSE: Record<string, string> = {
  rawchocolatemeister: TALLY.rawchocolatemeister,
};
