import { createBrowserClient } from "@supabase/ssr";

/**
 * ブラウザ用 Supabase クライアント（anon キー + RLS）。
 * HTTP は SDK 内部の fetch を使用。axios は使用しない。
 */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です。",
    );
  }
  return createBrowserClient(url, anonKey);
}
