import type { EventRow } from "./events";

/** JST calendar day as `YYYY-MM-DD` (string compare is valid for this format). */
export function calendarDateJST(date: Date = new Date()): string {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);
	const y = parts.find((p) => p.type === "year")!.value;
	const m = parts.find((p) => p.type === "month")!.value;
	const d = parts.find((p) => p.type === "day")!.value;
	return `${y}-${m}-${d}`;
}

/** True when `todayYmd` is strictly after sheet `end_date` (last day of event still listed on home). */
export function isEventEnded(event: EventRow, todayYmd: string): boolean {
	return todayYmd > event.endDate;
}

/** Ended list: newest `end_date` first, then newest `published_at`. */
export function sortEndedEventsForDisplay(rows: EventRow[]): EventRow[] {
	return [...rows].sort((a, b) => {
		if (a.endDate !== b.endDate) {
			return a.endDate < b.endDate ? 1 : -1;
		}
		return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
	});
}
