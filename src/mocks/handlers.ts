import { http, HttpResponse } from "msw";

// 샘플 랭킹 상품 데이터 동일
const sampleRankingProducts = [
  {
    id: 11526198,
    name: "스트로베리 초콜릿 생크림",
    price: { basicPrice: 39000, sellingPrice: 39000, discountRate: 0 },
    imageURL: "https://example.com/image.jpg",
    brandInfo: {
      id: 33,
      name: "투썸플레이스",
      imageURL: "https://example.com/brand.jpg",
    },
  },
  // 필요시 추가 상품...
];

export const handlers = [
  http.get("/api/products/ranking", ({ request }) => {
    // 쿼리 파라미터 추출
    const url = new URL(request.url);
    const targetType = url.searchParams.get("targetType") ?? "ALL";
    const rankType = url.searchParams.get("rankType") ?? "MANY_WISH";

    return HttpResponse.json({ data: sampleRankingProducts }, { status: 200 });
  }),

  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "test@kakao.com" && password === "password123") {
      return HttpResponse.json(
        {
          email: "test@kakao.com",
          name: "테스트유저",
          authToken: "mock-token",
        },
        { status: 200 }
      );
    } else if (email === "error@kakao.com") {
      return HttpResponse.json({ message: "서버 오류 발생" }, { status: 500 });
    } else {
      return HttpResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }
  }),
];
