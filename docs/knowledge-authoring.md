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
