import type { EventRow } from "./events";

/**
 * ニコニコ動画のジャンル分けに沿ったカテゴリ（表示ラベルは CSV `category` と完全一致させる）。
 */
export const NICONICO_CATEGORIES = [
	{ slug: "entertainment", label: "エンターテイメント" },
	{ slug: "radio", label: "ラジオ" },
	{ slug: "music-sound", label: "音楽・サウンド" },
	{ slug: "dance", label: "ダンス" },
	{ slug: "animals", label: "動物" },
	{ slug: "nature", label: "自然" },
	{ slug: "cooking", label: "料理" },
	{ slug: "travel-outdoor", label: "旅行・アウトドア" },
	{ slug: "vehicles", label: "乗り物" },
	{ slug: "sports", label: "スポーツ" },
	{ slug: "society-politics", label: "社会・政治・時事" },
	{ slug: "tech-craft", label: "技術・工作" },
	{ slug: "lecture", label: "解説・講座" },
	{ slug: "anime", label: "アニメ" },
	{ slug: "games", label: "ゲーム" },
	{ slug: "other", label: "その他" },
	{ slug: "sono", label: "例のソレ" },
] as const;

export type CategorySlug = (typeof NICONICO_CATEGORIES)[number]["slug"];

/** 静的ルート用：定義済みジャンルは常に全 slug生成（件数 0 でもページを用意し、dev の404 を防ぐ）。 */
export function allNiconicoCategorySlugs(): CategorySlug[] {
	return NICONICO_CATEGORIES.map((c) => c.slug);
}

const SLUG_SET = new Set<string>(NICONICO_CATEGORIES.map((c) => c.slug));
const LABEL_TO_SLUG = new Map<string, CategorySlug>(
	NICONICO_CATEGORIES.map((c) => [c.label, c.slug]),
);

export function isValidCategorySlug(slug: string): boolean {
	return SLUG_SET.has(slug.trim());
}

/** CSV の `category` 列（前後空白除去）が、定義どおりなら slug を返す */
export function categorySlugFromLabel(label: string): CategorySlug | null {
	const slug = LABEL_TO_SLUG.get(label.trim());
	return slug ?? null;
}

export function categoryLabelFromSlug(slug: string): string | null {
	const found = NICONICO_CATEGORIES.find((c) => c.slug === slug.trim());
	return found ? found.label : null;
}

export function eventMatchesCategorySlug(event: EventRow, slug: string): boolean {
	const s = categorySlugFromLabel(event.category);
	return s !== null && s === slug.trim();
}

/** Present category slugs in Niconico genre order. */
export function uniqueCategorySlugsInNiconicoOrder(events: EventRow[]): CategorySlug[] {
	const present = new Set<CategorySlug>();
	for (const e of events) {
		const s = categorySlugFromLabel(e.category);
		if (s) present.add(s);
	}
	return NICONICO_CATEGORIES.map((c) => c.slug).filter((s) => present.has(s));
}
