import type { EventRow } from "./events";

/**
 * ニコニコ動画のジャンル分けに沿ったカテゴリ（表示ラベルは CSV `category` と完全一致させる）。
 */
export const NICONICO_CATEGORIES = [
	{ slug: "entertainment", label: "\u30a8\u30f3\u30bf\u30fc\u30c6\u30a4\u30e1\u30f3\u30c8" },
	{ slug: "radio", label: "\u30e9\u30b8\u30aa" },
	{ slug: "music-sound", label: "\u97f3\u697d\u30fb\u30b5\u30a6\u30f3\u30c9" },
	{ slug: "dance", label: "\u30c0\u30f3\u30b9" },
	{ slug: "animals", label: "\u52d5\u7269" },
	{ slug: "nature", label: "\u81ea\u7136" },
	{ slug: "cooking", label: "\u6599\u7406" },
	{ slug: "travel-outdoor", label: "\u65c5\u884c\u30fb\u30a2\u30a6\u30c8\u30c9\u30a2" },
	{ slug: "vehicles", label: "\u4e57\u308a\u7269" },
	{ slug: "sports", label: "\u30b9\u30dd\u30fc\u30c4" },
	{ slug: "society-politics", label: "\u793e\u4f1a\u30fb\u653f\u6cbb\u30fb\u6642\u4e8b" },
	{ slug: "tech-craft", label: "\u6280\u8853\u30fb\u5de5\u4f5c" },
	{ slug: "lecture", label: "\u89e3\u8aac\u30fb\u8b1b\u5ea7" },
	{ slug: "anime", label: "\u30a2\u30cb\u30e1" },
	{ slug: "games", label: "\u30b2\u30fc\u30e0" },
	{ slug: "other", label: "\u305d\u306e\u4ed6" },
	{ slug: "sono", label: "\u4f8b\u306e\u30bd\u30ec" },
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
