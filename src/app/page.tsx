export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        投稿祭スケジュール
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Next.js / Supabase の足場のみ整備済みです。一覧・投稿フォーム等はこれから実装します。
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        仕様は <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">doc/functional-spec.md</code>{" "}
        を参照してください。
      </p>
    </main>
  );
}
