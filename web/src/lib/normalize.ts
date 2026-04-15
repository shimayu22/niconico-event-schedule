/** ニコニコ動画: 完全 URL または sm/nm 等の ID のみを許容し、watch URL に統一する。 */
export function normalizeNiconicoUrl(raw: string): string | null {
	const s = raw.trim();
	if (!s) return null;
	if (/^https?:\/\//i.test(s)) return s;
	return `https://www.nicovideo.jp/watch/${s}`;
}

/** `@` を除いたハンドル。空なら null。 */
export function normalizeXHandle(raw: string): string | null {
	const s = raw.trim().replace(/^@+/, "");
	return s || null;
}

export function xProfileUrl(handle: string): string {
	return `https://x.com/${encodeURIComponent(handle)}`;
}
