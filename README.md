# AI COACHING

添付の完成イメージと実装指示書に基づく、ヘッダー・ヒーローのみの実装です。

## ローカル起動

```powershell
cd C:\Users\takas\AI-Coaching
npm install
npm run dev
```

http://127.0.0.1:3000 を開いてください。本番確認は `npm run build` → `npm start`。

## 構成

- `Header`: PCナビゲーション、モバイルメニュー、Escape・キーボード対応。
- `HeroSection` / `HeroHeadline` / `HeroCTA`: HTMLコピーとCTA、初回GSAP演出。
- `HeroVisual` / `FloatingRibbon`: 個別の透過素材、背景レイヤー。
- `LearningRoadmap` / `RoadmapCard`: HTMLの4ステップ、SVGの接続線。
- `CoachingLanding`: ページ内の案内ダイアログ。Escapeで閉じ、起点にフォーカスを戻します。
- `src/lib/hero-content.ts`: 画像パス・文言・ステップカラー。
- `src/app/globals.css`: レイヤーの配置、ブランドカラー、レスポンシブスタイル。

## 提供素材

元ファイルは `画像素材/ヒーローセクション/` にそのまま保管し、コピーを `public/images/hero/` に配置しました。全7点がRGBA WebPです。

| 元ファイル末尾 | コピー先 | 寸法 | 使用方法 |
|---|---|---|---|
| `18_19_42-1.webp` | `woman.webp` | 1122 × 1402 | 人物、next/image |
| `18_19_49-2.webp` | `ribbon-warm.webp` | 2172 × 724 | ピンク・オレンジのリボン |
| `18_19_55-3.webp` | `ribbon-cool.webp` | 2172 × 724 | 背景リボンと右下ブルーのアクセント |
| `18_20_01-4.webp` | `city.webp` | 2172 × 724 | 都市シルエット |
| `18_20_07-5.webp` | `roadmap-reference.webp` | 1672 × 941 | 再構築の参照用。画面にはHTMLカードを表示 |
| `18_20_13-6.webp` | `handwriting.webp` | 1536 × 1024 | 手書きコピー、代替テキストあり |
| `18_20_19-7.webp` | `growth-reference.webp` | 1536 × 1024 | 再構築の参照用。画面にはHTMLテキストと棒グラフを表示 |

## アニメーション

完成配置を基準に、同じ「AI」のDOM要素を中央付近から先頭位置へ移動します。文字0.8秒、移動0.85秒、残りのコピー、補助コピー・CTA、01→04のカードと接続線を順に表示し、約3.6秒で完了します。リボンは21秒・24秒で往復。GSAP matchMediaでReactの再マウントとreduced-motion時の解除に対応し、途中のリサイズでは完成状態に移行します。

## 確認コマンド

```powershell
npm run build
npm run typecheck
npm run lint
```

## 公開前に決める項目・注意点

- 相談の受付URL、料金、お役立ち記事は未提供です。CTAとナビは壊れたリンクを作らず、ページ内案内を開きます。予約送信機能はありません。
- 指示書を優先してNoto Sans JPを使用しています。参考画像の明朝風の日本語見出しとは字形が異なります。
- 人物・リボンは提供された個別素材のため、完成イメージの人物の表情やリボンの輪郭と細部が異なります。
- 初回インストール時、lint用の開発依存（eslint-config-next → fast-glob → micromatch → braces）に既知の高リスク警告5件が出ました。`braces` の修正版はレジストリに存在せず、推奨の自動修正はNextのlint構成を旧メジャーに下げるため適用していません。本番依存の監査は別途確認しています。

表示検証の詳細は `design-qa.md` を参照してください。
