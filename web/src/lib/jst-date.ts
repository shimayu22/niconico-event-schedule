import type { EventRow } from "./events";

/** Sheet `YYYY-MM-DD` as that calendar day at noon JST (for weekday / display; JST = UTC+9, no DST). */
function dateFromYmdJst(ymd: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
	if (!match) return null;
	const y = Number(match[1]);
	const m = Number(match[2]);
	const d = Number(match[3]);
	if (m < 1 || m > 12 || d < 1 || d > 31) return null;
	return new Date(Date.UTC(y, m - 1, d, 3, 0, 0));
}

/** 開始日・終了日の年を1行で（カードの開催期間ブロック用）。同年なら `2025年`、またぐなら `2025年〜2026年`。 */
export function formatPeriodYearCaption(startYmd: string, endYmd: string): string | null {
	const re = /^(\d{4})-\d{2}-\d{2}$/;
	const ms = re.exec(startYmd.trim());
	const me = re.exec(endYmd.trim());
	if (!ms || !me) return null;
	const yStart = ms[1];
	const yEnd = me[1];
	if (yStart === yEnd) return `${yStart}年`;
	return `${yStart}年〜${yEnd}年`;
}

/** e.g. `5月1日（金）` — weekday is single kanji 月火水木金土日 */
export function formatYmdJaMonthDayWeekday(ymd: string): string | null {
	const date = dateFromYmdJst(ymd);
	if (!date || Number.isNaN(date.getTime())) return null;
	const parts = new Intl.DateTimeFormat("ja-JP", {
		timeZone: "Asia/Tokyo",
		month: "numeric",
		day: "numeric",
		weekday: "narrow",
	}).formatToParts(date);
	const month = parts.find((p) => p.type === "month")?.value;
	const day = parts.find((p) => p.type === "day")?.value;
	const weekday = parts.find((p) => p.type === "weekday")?.value;
	if (month == null || day == null || weekday == null) return null;
	return `${month}月${day}日（${weekday}）`;
}

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

/** JST の `todayYmd` が開催期間内（開始日〜終了日・両端含む）。 */
export function isEventOngoing(event: EventRow, todayYmd: string): boolean {
	return event.startDate <= todayYmd && todayYmd <= event.endDate;
}

/** まだ終了しておらず（終了日は今日以降）、かつ開催開始前。 */
export function isEventUpcoming(event: EventRow, todayYmd: string): boolean {
	return !isEventEnded(event, todayYmd) && todayYmd < event.startDate;
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
