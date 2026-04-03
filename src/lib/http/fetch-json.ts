/**
 * 外部 HTTP 呼び出しは標準の fetch のみ使用する（axios 禁止方針）。
 * Discord Webhook・Turnstile 検証など Route Handler から利用。
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new Error(`JSON でないレスポンス: ${res.status} ${text.slice(0, 200)}`);
    }
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  return data as T;
}
