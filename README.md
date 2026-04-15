# niconico-event-schedule

ニコニコ動画「投稿祭」スケジュールを**非公式**に掲載するサイトのリポジトリ（開発中）。

- **現在の方針（静的・フォーム／シート・Astro 予定）**: [doc/static-site-strategy.md](doc/static-site-strategy.md)
- 機能仕様（旧・Supabase 案）: [doc/old/functional-spec.md](doc/old/functional-spec.md)
- アーキテクチャ（旧・Next + Supabase）: [doc/old/system-architecture.md](doc/old/system-architecture.md)
- DB・RLS（参考・現方針では未使用）: [doc/old/supabase/README.md](doc/old/supabase/README.md)

## フロントエンド

**Next.js は撤去済み**（2026-04）。サイト本体は **`web/`** の **Astro**（[static-site-strategy.md](doc/static-site-strategy.md)）。

### デプロイ（方針：Cloudflare Pages + GitHub 非公開）

**本番ホスティング**は [doc/static-site-strategy.md](doc/static-site-strategy.md) **§2.8** のとおり **Cloudflare Pages** とし、**GitHub リポジトリは非公開（private）** を前提にします。ビルド時に **`PUBLIC_EVENTS_CSV_URL`**（公開 CSV の URL）を Pages 側の環境変数で渡してください。

**移行未了**：`.github/workflows/deploy-web.yml` は **GitHub Pages 向け**のままです。Cloudflare の **Git 連携**に切り替えるか、Actions から Wrangler 等で Pages へデプロイするか決めたうえで、本 README とワークフローを更新します。プロジェクトサイト形式で GitHub Pages に載せる場合は `web/astro.config.mjs` の `base` が必要になることがあります（Cloudflare 側の URL 構成に合わせて調整）。

## HTTP クライアント方針（axios 不使用）

**axios は使わない**方針です。外部通信は **標準の `fetch`** のみを用います（Astro でも同様）。

依存追加後は `npm ls axios` で間接依存がないか確認してください。

## ディレクトリ構成（概要）

| パス | 内容 |
|------|------|
| `doc/` | 仕様・日報・**現行方針**（`static-site-strategy.md`） |
| `web/` | 静的サイト本体（**Astro 予定**。スキャフォールド後に本表を更新） |
| `doc/old/supabase/` | 旧構成用マイグレーション（参考。フォーム／シート構成では未使用） |
