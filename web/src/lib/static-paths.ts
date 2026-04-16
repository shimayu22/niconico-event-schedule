import type { EventRow } from "./events";
import { loadEvents } from "./events";
import { calendarDateJST } from "./jst-date";
import { uniqueStartMonthsDescending } from "./start-month";

/** ビルド時点 JST で `pick` に合うイベントの開始月だけ静的パスを生成する。 */
export async function staticPathsForStartMonths(
	pick: (event: EventRow, todayYmd: string) => boolean,
): Promise<{ params: { ym: string } }[]> {
	try {
		const all = await loadEvents();
		const todayYmd = calendarDateJST();
		const pool = all.filter((e) => pick(e, todayYmd));
		return uniqueStartMonthsDescending(pool).map((ym) => ({ params: { ym } }));
	} catch {
		return [];
	}
}
