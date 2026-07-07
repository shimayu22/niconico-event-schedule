# niconico-event-schedule

ニコニコ動画「投稿祭」の開催情報を、**Google スプレッドシート（公開 CSV）** から読み込んで一覧表示する **静的サイト**のテンプレートです（**非公式**）。

各自が **自分の Cloudflare Pages** と **自分のスプレッドシート** を用意してホスティング・運用する想定です。本リポジトリのコードを Fork しても、**他者の本番サイトやデータには依存しません**。

## 技術スタック

- フロント: **Astro**（`web/`）
- データ: ビルド時に **公開 CSV** を `fetch`（`PUBLIC_EVENTS_CSV_URL`）
- ホスティング: **Cloudflare Pages**（Git 連携）
- 再ビルド: `main` への push / **Deploy Hook**（任意・日次 Actions 付属）

## 前提

- Node.js **22.12.0 以上**（`web/package.json` の `engines` 参照）
- npm
- 掲載用 Google スプレッドシート（列定義は [doc/static-site-strategy.md](doc/static-site-strategy.md) §2.2）

## ローカル開発

```bash
cd web
npm install
cp .env.example .env
# .env に PUBLIC_EVENTS_CSV_URL=（掲載用 CSV の公開 URL）を設定
npm run dev
```

ブラウザで http://localhost:4321/ を開きます。

本番ビルドの確認:

```bash
cd web
npm run build
npm run preview
```

## 本番デプロイ（初回）

**初回セットアップ**（スプレッドシート・Cloudflare Pages・GitHub Secret・DNS）:

→ **[doc/本番初回セットアップ手順.md](doc/本番初回セットアップ手順.md)**

概要:

1. 掲載用シートを **ウェブに公開（CSV）** し URL を取得
2. Cloudflare Pages で **GitHub リポジトリ**（Fork 可）と連携（Root: `web`、Build: `npm run build`、Output: `dist`）
3. 環境変数 **`PUBLIC_EVENTS_CSV_URL`** を設定（任意: **`PUBLIC_CF_WEB_ANALYTICS_TOKEN`**）
4. （任意）Deploy Hook と GitHub Secret **`CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`** で日次・手動再ビルド

**日常運用**（シート更新後の再デプロイなど）: [doc/運用手順書.md](doc/運用手順書.md)

## 環境変数

| 名前 | 用途 | 設定場所 |
|------|------|----------|
| `PUBLIC_EVENTS_CSV_URL` | 掲載用 CSV の公開 URL（**必須**） | ローカル: `web/.env` / 本番: Cloudflare Pages |
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | Cloudflare Web Analytics（任意） | 同上 |
| `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL` | Deploy Hook の URL（任意） | GitHub Actions Secret のみ |

**機密情報**（Deploy Hook URL、CSV の非公開 URL など）はリポジトリにコミットしないでください。

## ディレクトリ構成

| パス | 内容 |
|------|------|
| `web/` | Astro アプリ本体 |
| `doc/` | 仕様・手順・構成図 |
| `doc/static-site-strategy.md` | 列定義・プロダクト方針 |
| `doc/本番初回セットアップ手順.md` | 初回デプロイ手順 |
| `doc/運用手順書.md` | シート更新・再ビルドの日常運用 |
| `doc/サイト構成図.md` | システム構成（Mermaid） |
| `doc/daily/` | 開発日報（履歴） |
| `doc/old/` | 旧 Supabase / Next.js 案（参考） |
| `.github/workflows/trigger-cloudflare-pages.yml` | 定時・手動 Deploy Hook 実行 |

## Fork について

本リポジトリは **GitHub public** を想定しています。Fork 後は **自分の Cloudflare アカウント**で Pages プロジェクトを作成し、[本番初回セットアップ手順](doc/本番初回セットアップ手順.md) に従って **自分用の CSV URL・Deploy Hook・ドメイン** を設定してください。

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。

**注意:** 本ライセンスは**ソースコード**に適用されます。サイト上のイベント情報・ニコニコ動画の商標・各イベントの告知内容の利用可否は、各自のデータと各権利者の条件に従ってください。

## HTTP クライアント方針

**axios は使いません**。外部通信は標準の **`fetch`** のみです。

## 関連ドキュメント

- [static-site-strategy.md](doc/static-site-strategy.md) — 現行方針・列定義
- [functional-spec.md](doc/old/functional-spec.md) — 旧機能仕様（参考）
- [system-architecture.md](doc/old/system-architecture.md) — 旧アーキテクチャ（参考）
