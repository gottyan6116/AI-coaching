# Knowledgeの記事管理

- 記事は `src/content/knowledge/<slug>.mdx` に追加します。本文はMDX、冒頭の `export const metadata` が一覧・詳細・SEO・サイトマップの共通データです。
- `slug` はファイル名と同じ半角英数字・ハイフンです。`title`, `description`, `category`, `publishedAt`, `updatedAt`, `thumbnail`, `tags`, `status` を指定します。
- カテゴリは `basics` / `business` / `development` / `news`。一覧のカテゴリ名は `src/lib/knowledge-types.ts` にあります。
- `status: "published"` のみが公開用一覧・記事ページ・サイトマップに含まれます。公開する際は本文を校了し、公開日と更新日を `YYYY-MM-DD` で設定してください。
- `status: "sample"` は表示確認用です。開発中、または一覧・詳細URLに `?preview=sample` を指定した場合だけ表示します。明示的なサンプル表記、noindexを付与し、Article構造化データとサイトマップには含めません。サンプルは秘密情報のプレビュー機能ではありません。
- `status: "draft"` はプレビューからも除外します。機密データや個人情報は記事リポジトリに保存しないでください。
- サムネイルは `public/images/` 内に追加し、`/images/...` のパスを設定します。16:9の枠へ表示されます。
- MDXはサーバーで実行されます。信頼できるリポジトリ管理者だけが編集し、外部入力やリモート原稿を直接実行しないでください。
- 一覧は4件ずつ追加表示します。公開記事がない場合は準備中表示になります。
- canonicalの基準URLは `src/lib/knowledge-types.ts` の `siteUrl` です。
- 無料相談の実際の受付先は未提供です。CTAは既存サイトと同じ準備中ダイアログを表示します。
- Three.jsはKnowledge配下でのみ遅延読み込みします。WebGL非対応・コンテキスト喪失時はCSS背景へ切り替え、ページ非表示時は描画を停止します。reduced-motionでは静止画として1フレームだけ描画します。

## 記事詳細の共通テンプレート

記事ごとのReactページ作成は不要です。既存と同じ `export const metadata` を使います（YAML Frontmatterの追加は不要です）。任意の項目として、`thumbnailAlt`, `summary: ["要点1", "要点2"]`, `author: { name: "実際の著者名", url: "https://…" }`, `canonical: "https://…"` を指定できます。未提供の著者・公開日は生成しません。`summary` 未設定時は概要文をまとめ欄に再利用します。画像未設定時はブランドの静止背景を表示します。画像は `/images/` 内のローカル素材を使用してください。

本文の見出しは `## H2` / `### H3` を使用します。H1はタイトル専用で、MDX内のH1はエラーになります。MDXの構文木からH2・H3の文字列、重複しないID、目次を同時に生成するため、同名の見出しにも対応します。見出しはMarkdown形式で記述してください。JSXで直接書いた見出しや動的な式は目次の対象外です。

読了時間はメタデータのコードを除く本文の文字数を基準に、500文字あたり約1分で算出する目安です。`updatedAt` が公開日と同じ場合、更新日は重複表示しません。

実践用コンポーネントはimportせずに使えます。

```mdx
<PointBox>

**大切なポイント**をここに記載します。

</PointBox>

<PromptLab title="試す内容" prompt={"依頼文の1行目。\n依頼文の2行目。"} />

<TryItYourself title="練習してみる" items={["最初の操作", "次の操作"]} />

<ArticleImage src="/images/learning/basics.webp" alt="画像の内容" caption="任意のキャプション" width={1200} height={675} />
```

`PromptLab` はClipboard APIを使用します。許可拒否・非対応時は手動選択へ案内し、成功と誤表示しません。`TryItYourself` のチェック状態はページ内だけで保持し、再読み込み後には引き継ぎません。

表はGitHub Flavored Markdown、コードブロックはフェンス記法で書けます。モバイルでは表と長いコード行だけを内部で横スクロールします。引用・入れ子リスト・注釈・強調も共通の本文スタイルで表示します。

関連記事は同一カテゴリ→共通タグ数→公開日の順で3件まで選びます。公開記事からサンプル・下書きへ誘導しません。サンプル閲覧中だけ、明示されたサンプルを関連記事にも表示します。

PC目次は本文エリア内だけを追従し、現在の見出しをIntersectionObserverで判定します。スマホ目次は本文前のdetailsで開閉できます。記事詳細のLiquid Glassは同じ描画を再利用して薄く・遅くし、スマホでは描画を停止してCSS背景を使います。一覧ページの背景設定は維持します。

表示確認用の記事：`/knowledge/chatgpt-basics?preview=sample`。POINT、コピー、チェック、H2/H3、表、コード、画像をまとめて確認できます。サンプルのままなので公開一覧とサイトマップには含まれません。

公開用の入門記事は `/knowledge/what-is-ai` です。`<LearningInferenceDiagram />` で学習・推論の説明用図解を使用できます。図はServer Componentで、スマホでは縦に並び、JavaScriptなしでも読めます。編集会議と原稿レビューの記録は `docs/editorial/2026-10-15-what-is-ai.md` にあります。

`npm run test:knowledge`（Node.js 22.18以降）で見出しID・読了時間・H1制約・関連記事の選定を確認できます。合わせて `npm run lint`, `npm run typecheck`, `npm run build` を実行します。
