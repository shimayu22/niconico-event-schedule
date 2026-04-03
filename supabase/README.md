# Supabase（DB・Storage・RLS）

## マイグレーションの適用

1. [Supabase](https://supabase.com) でプロジェクトを作成する。
2. **SQL Editor** で `migrations/20260402120000_init_schema.sql` の内容を **丸ごと実行**する（または [Supabase CLI](https://supabase.com/docs/guides/cli) の `supabase db push` で適用）。

## 初回必須：管理者メール

マイグレーション直後は `private.admin_config` にプレースホルダが入っています。**必ず自分のメールに更新**してください（Supabase Auth で使うアドレスと **同じ** にする）。

```sql
update private.admin_config
set admin_email = 'あなたのメール@example.com'
where id = 1;
```

## Auth 設定（推奨）

- **Authentication → Providers**: マジックリンクまたはパスワードを有効化。
- **新規ユーザー登録**: 運用方針どおり **一般サインアップを無効**にし、Dashboard から **あなたのユーザのみ** 作成する（[system-architecture.md](../doc/system-architecture.md) 「管理者の認定」参照）。

## 環境変数（Next.js 側）

プロジェクト設定から **Project URL** と **anon / service_role** キーを取得し、ルートの `.env.local` に設定（`.env.example` 参照）。

## Storage

- バケット ID: `event-thumbnails`（公開読み取り、最大 5MB、JPEG/PNG/WebP）。
- **アップロードはクライアントから anon では行わない**想定（Route Handler が `service_role` でアップロード）。
