export const SORTOPTIONS = ["받고 싶어한", "선물 받은", "선물 보낸"] as const;

export type SortOptionType = (typeof SORTOPTIONS)[number];
