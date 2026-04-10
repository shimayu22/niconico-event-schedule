# niconico-event-schedule

ニコニコ動画「投稿祭」スケジュールを**非公式**に掲載するサイトのリポジトリ（開発中）。

- **現在の方針（静的・フォーム／シート）**: [doc/static-site-strategy.md](doc/static-site-strategy.md)
- 機能仕様（旧・Supabase 案）: [doc/functional-spec.md](doc/functional-spec.md)
- アーキテクチャ（旧・Next + Supabase）: [doc/system-architecture.md](doc/system-architecture.md)
- DB・RLS: [supabase/README.md](supabase/README.md)

## 開発環境

前提: **Node.js 20+**、`npm`（または `pnpm` / `yarn`）。

```bash
cp .env.example .env.local
# .env.local を編集（Supabase の URL / anon key など）

npm install
npm run dev
```

ブラウザで <http://localhost:3000>。

## HTTP クライアント方針（axios 不使用）

**axios は依存関係に入れず、コードからも使わない**方針です（サプライチェイン・方針の整理のため）。

- ブラウザ／サーバの通常の HTTP: **標準の `fetch`**
- Supabase: **`@supabase/supabase-js`** / **`@supabase/ssr`**（内部は fetch ベース）

依存追加後は次で間接依存が混ざっていないか確認してください。

```bash
npm ls axios
```

`axios` が表示されたら別ライブラリに置き換えるか、パッチ／フォークを検討してください。

補助ユーティリティ: [src/lib/http/fetch-json.ts](src/lib/http/fetch-json.ts)

## ディレクトリ構成（概要）

| パス | 内容 |
|------|------|
| `src/app/` | Next.js App Router |
| `src/lib/supabase/` | Supabase クライアント（ブラウザ・サーバ） |
| `doc/` | 仕様・日報 |
| `supabase/migrations/` | PostgreSQL・RLS・Storage 初期マイグレーション |

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバ（Turbopack） |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバ |
| `npm run lint` | ESLint |
