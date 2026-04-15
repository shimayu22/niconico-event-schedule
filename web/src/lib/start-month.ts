import type { EventRow } from "./events";

/** `start_date`（`YYYY-MM-DD`）から開始月 `YYYY-MM` を得る。 */
export function startMonthYm(startDate: string): string {
	const ymd = startDate.trim();
	return ymd.length >= 7 ? ymd.slice(0, 7) : ymd;
}

const ymRe = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isValidYm(ym: string): boolean {
	return ymRe.test(ym.trim());
}

/** `2026-04` → 表示用「2026年4月」 */
export function formatStartMonthLabelJa(ym: string): string {
	const [y, m] = ym.split("-");
	const mi = parseInt(m, 10);
	if (!y || Number.isNaN(mi)) return ym;
	return `${y}年${mi}月`;
}

/** イベント集合から開始月一覧（重複除く・降順：新しい月が先） */
export function uniqueStartMonthsDescending(events: EventRow[]): string[] {
	const set = new Set<string>();
	for (const e of events) {
		const ym = startMonthYm(e.startDate);
		if (isValidYm(ym)) set.add(ym);
	}
	return [...set].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
}

export function eventStartsInMonth(event: EventRow, ym: string): boolean {
	return startMonthYm(event.startDate) === ym;
}
