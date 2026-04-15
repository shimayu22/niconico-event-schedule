import Papa from "papaparse";
import { normalizeNiconicoUrl, normalizeXHandle, xProfileUrl } from "./normalize";

export type EventRow = {
	id: string;
	publishedAt: string;
	submitterName: string;
	eventName: string;
	xHandle: string | null;
	xUrl: string | null;
	niconicoUrl: string;
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
		startDate,
		endDate,
		category,
	};
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
		const ta = Date.parse(a.publishedAt);
		const tb = Date.parse(b.publishedAt);
		const na = Number.isNaN(ta);
		const nb = Number.isNaN(tb);
		if (na && nb) return a.id.localeCompare(b.id);
		if (na) return 1;
		if (nb) return -1;
		return tb - ta;
	});

	return rows;
}
