/** watch URL から `sm123` / `nm123` 形式のコンテンツ ID を取り出す。 */
export function niconicoContentIdFromWatchUrl(watchUrl: string): string | null {
	try {
		const u = new URL(watchUrl);
		const m = u.pathname.match(/\/watch\/([^/?#]+)/i);
		const id = m?.[1]?.trim();
		return id || null;
	} catch {
		return null;
	}
}

/**
 * getthumbinfo の `thumbnail_url` はサフィックスなしだと低解像度（例: 130×100）のことが多い。
 * `nicovideo.cdn.nimg.jp/thumbnails/...` については **`.L`（360×270）** にそろえる（このパターンで取れる実質最大）。
 */
function preferNicovideoCdnThumbnailLarge(thumbnailUrl: string): string {
	try {
		const u = new URL(thumbnailUrl);
		if (u.hostname !== "nicovideo.cdn.nimg.jp" || !u.pathname.includes("/thumbnails/")) {
			return thumbnailUrl;
		}
		const path = u.pathname.replace(/\.(M|L)$/i, "");
		u.pathname = `${path}.L`;
		return u.toString();
	} catch {
		return thumbnailUrl;
	}
}

/**
 * ext.nicovideo.jp の getthumbinfo でサムネイル URL を取得する。
 * 失敗時は null（呼び出し側でプレースホルダ表示）。
 */
export async function fetchNiconicoThumbnailUrl(contentId: string): Promise<string | null> {
	const apiUrl = `https://ext.nicovideo.jp/api/getthumbinfo/${encodeURIComponent(contentId)}`;
	const res = await fetch(apiUrl);
	if (!res.ok) return null;
	const xml = await res.text();
	if (!/status="ok"/.test(xml)) return null;
	const m = xml.match(/<thumbnail_url>([^<]*)<\/thumbnail_url>/);
	const url = m?.[1]?.trim();
	if (!url) return null;
	return preferNicovideoCdnThumbnailLarge(url);
}
