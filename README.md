# niconico-event-schedule

ニコニコ動画「投稿祭」スケジュールを**非公式**に掲載するサイトのリポジトリ（開発中）。

- **現在の方針（静的・フォーム／シート・Astro 予定）**: [doc/static-site-strategy.md](doc/static-site-strategy.md)
- 機能仕様（旧・Supabase 案）: [doc/old/functional-spec.md](doc/old/functional-spec.md)
- アーキテクチャ（旧・Next + Supabase）: [doc/old/system-architecture.md](doc/old/system-architecture.md)
- DB・RLS（参考・現方針では未使用）: [doc/old/supabase/README.md](doc/old/supabase/README.md)

## フロントエンド

**Next.js は撤去済み**（2026-04）。サイト本体は **`web/`** の **Astro**（[static-site-strategy.md](doc/static-site-strategy.md)）。

### デプロイ（GitHub Pages）

`.github/workflows/deploy-web.yml` が **main への push**・**毎日定時**・**手動（workflow_dispatch）** で `web/` をビルドして Pages に公開します。リポジトリの **Settings → Secrets and variables → Actions** に `PUBLIC_EVENTS_CSV_URL`（公開 CSV の URL）を登録し、**Settings → Pages** の Source を **GitHub Actions** にしてください。プロジェクトサイト（`https://user.github.io/repo/`）の場合は `web/astro.config.mjs` に `base: '/リポジトリ名/'` が必要になることがあります。

## HTTP クライアント方針（axios 不使用）

**axios は使わない**方針です。外部通信は **標準の `fetch`** のみを用います（Astro でも同様）。

依存追加後は `npm ls axios` で間接依存がないか確認してください。

## ディレクトリ構成（概要）

| パス | 内容 |
|------|------|
| `doc/` | 仕様・日報・**現行方針**（`static-site-strategy.md`） |
| `web/` | 静的サイト本体（**Astro 予定**。スキャフォールド後に本表を更新） |
| `doc/old/supabase/` | 旧構成用マイグレーション（参考。フォーム／シート構成では未使用） |
