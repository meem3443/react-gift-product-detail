// src/constants/rankingOptions.ts

// 필요한 타입들을 임포트 (product.ts에서 가져옴)
import { type TargetType, type RankType } from "../api/product";

// 필터 옵션 상수
export const FILTER_OPTIONS: { id: TargetType; label: string; img: string }[] =
  [
    { id: "ALL", label: "전체", img: "ALL" },
    { id: "FEMALE", label: "여성이", img: "👩🏻" },
    { id: "MALE", label: "남성이", img: "👱🏻‍♂️" },
    { id: "TEEN", label: "청소년이", img: "🧑🏻‍🎓" },
  ];

// 정렬 옵션 상수
export const SORT_OPTIONS: { id: RankType; label: string }[] = [
  { id: "MANY_WISH", label: "받고 싶어한" },
  { id: "MANY_RECEIVE", label: "많이 선물한" },
  { id: "MANY_WISH_RECEIVE", label: "위시로 받은" },
];
