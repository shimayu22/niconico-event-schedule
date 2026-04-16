import Papa from "papaparse";
import { fetchNiconicoThumbnailUrl, niconicoContentIdFromWatchUrl } from "./niconico-thumb";
import { normalizeNiconicoUrl, normalizeXHandle, xProfileUrl } from "./normalize";

export type EventRow = {
	id: string;
	publishedAt: string;
	submitterName: string;
	eventName: string;
	xHandle: string | null;
	xUrl: string | null;
	niconicoUrl: string;
	thumbnailUrl: string | null;
	startDate: string;
	endDate: string;
	category: string;
};

function stripBom(text: string): string {
	return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function toStr(v: unknown): string {
	if (v == null) return "";
	return String(v).trim();
}

function mapRawRow(raw: Record<string, string>): EventRow | null {
	const id = toStr(raw["id"]);
	if (!id) return null;

	const publishedAt = toStr(raw["published_at"]);
	const submitterName = toStr(raw["submitter_name"]);
	const eventName = toStr(raw["event_name"]);
	const startDate = toStr(raw["start_date"]);
	const endDate = toStr(raw["end_date"]);
	const category = toStr(raw["category"]);
	const niconicoUrl = normalizeNiconicoUrl(toStr(raw["niconico_url"]));
	const xHandle = normalizeXHandle(toStr(raw["x_handle"]));

	if (
		!publishedAt ||
		!submitterName ||
		!eventName ||
		!niconicoUrl ||
		!startDate ||
		!endDate ||
		!category
	) {
		return null;
	}

	return {
		id,
		publishedAt,
		submitterName,
		eventName,
		xHandle,
		xUrl: xHandle ? xProfileUrl(xHandle) : null,
		niconicoUrl,
		thumbnailUrl: null,
		startDate,
		endDate,
		category,
	};
}

async function attachThumbnails(rows: EventRow[]): Promise<void> {
	const cache = new Map<string, string | null>();

	const getForContentId = async (contentId: string): Promise<string | null> => {
		const hit = cache.get(contentId);
		if (hit !== undefined) return hit;
		const thumb = await fetchNiconicoThumbnailUrl(contentId);
		cache.set(contentId, thumb);
		return thumb;
	};

	await Promise.all(
		rows.map(async (row) => {
			const cid = niconicoContentIdFromWatchUrl(row.niconicoUrl);
			row.thumbnailUrl = cid ? await getForContentId(cid) : null;
		}),
	);
}

export async function loadEvents(): Promise<EventRow[]> {
	const url = import.meta.env.PUBLIC_EVENTS_CSV_URL?.trim();
	if (!url) return [];

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`CSV の取得に失敗しました (${res.status} ${res.statusText})`);
	}

	const text = stripBom(await res.text());
	const parsed = Papa.parse<Record<string, string>>(text, {
		header: true,
		skipEmptyLines: "greedy",
		transformHeader: (h) => h.trim(),
	});

	if (parsed.errors.length > 0) {
		const msg = parsed.errors.map((e) => e.message).join("; ");
		throw new Error(`CSV の解析エラー: ${msg}`);
	}

	const rows: EventRow[] = [];
	for (const raw of parsed.data) {
		const row = mapRawRow(raw);
		if (row) rows.push(row);
	}

	rows.sort((a, b) => {
		if (a.startDate !== b.startDate) {
			return a.startDate < b.startDate ? 1 : -1;
		}
		const ta = Date.parse(a.publishedAt);
		const tb = Date.parse(b.publishedAt);
		const na = Number.isNaN(ta);
		const nb = Number.isNaN(tb);
		if (na && nb) return a.id.localeCompare(b.id);
		if (na) return 1;
		if (nb) return -1;
		return tb - ta;
	});

	await attachThumbnails(rows);

	return rows;
}
