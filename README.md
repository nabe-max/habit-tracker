# SNS投稿案ジェネレーター

AIがSNS投稿案をまとめて生成するWebアプリのMVPです。  
個人クリエイター・個人事業主・副業ユーザー向けに、テーマ・ターゲット・トーンを指定するだけで投稿案を一括生成できます。

## 技術スタック

- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- shadcn/ui
- OpenAI SDK
- LocalStorage

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、OpenAI APIキーを設定してください。

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000/generate](http://localhost:3000/generate) を開いてください。

## ビルド

```bash
npm run build
npm start
```

## 主な機能

- **投稿案の一括生成** — テーマ・ターゲット・トーン・生成数（10/20/30）を指定
- **文体学習** — 過去投稿を貼り付けると、同じ文体・構成で生成
- **コピー** — ワンクリックでクリップボードにコピー
- **保存** — LocalStorageに投稿案を保存（`savedPosts` キー）

## ディレクトリ構成

```
app/
├── generate/page.tsx      # メインページ
├── api/generate/route.ts  # OpenAI API Route
components/
├── InputForm.tsx          # 入力フォーム
├── PostCard.tsx           # 投稿カード
├── Loading.tsx            # ローディング表示
├── Header.tsx             # ヘッダー
hooks/
└── useGenerate.ts         # 生成ロジック
lib/
└── openai.ts              # OpenAI設定・プロンプト
types/
└── post.ts                # 型定義
utils/
├── storage.ts             # LocalStorage操作
└── clipboard.ts           # クリップボード操作
```

## 将来の拡張

以下の機能追加を想定した設計になっています。

- ログイン（Supabase）
- Stripe課金
- 生成履歴・お気に入り
- CSV出力
- X / Threads / LinkedIn / Instagram 投稿
- 多言語対応

## ライセンス

Private
