import { http, HttpResponse, delay } from "msw";

interface LoginRequestBody {
  email: string;
  password: string;
}

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
];

const productDetails = {
  description: "이 상품은 아주 특별한 경험을 선사합니다.",
  announcements: [
    { name: "유효기간", value: "발행일로부터 365일" },
    { name: "사용불가매장", value: "일부 매장 제외" },
  ],
};

const productReviews = {
  totalCount: 5,
  reviews: [
    { id: 1, authorName: "김현", content: "너무 맛있어요!" },
    { id: 2, authorName: "박지", content: "선물하기 좋아요." },
    { id: 3, authorName: "이정", content: "재구매 의사 있습니다." },
  ],
};

const productWishInfo = {
  wishCount: 123,
  isWished: false,
};

export const handlers = [
  http.get("/api/products/ranking", async () => {
    await delay(500);
    return HttpResponse.json({ data: sampleRankingProducts }, { status: 200 });
  }),

  http.post<never, LoginRequestBody>("/api/login", async ({ request }) => {
    const { email, password } = await request.json();
    await delay(500);

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

  // 상품 기본 정보 핸들러 (GiftDetailPage의 뼈대를 위해 항상 정상 응답)
  http.get("/api/products/:productId", async ({ params }) => {
    const { productId } = params;
    await delay(500);
    return HttpResponse.json(
      {
        id: productId,
        name: "테스트 상품",
        price: { sellingPrice: 10000 },
        imageURL: "https://example.com/product.jpg",
        brandInfo: {
          id: 1,
          name: "샘플 브랜드",
          imageURL: "https://example.com/brand.jpg",
        },
      },
      { status: 200 }
    );
  }),

  // 상품 상세 정보 핸들러 (123번 상품에 대해 에러)
  http.get("/api/products/:productId/detail", async ({ params }) => {
    const { productId } = params;
    await delay(500);

    if (productId === "123") {
      return HttpResponse.json(
        { message: "상품 상세 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return HttpResponse.json(productDetails, { status: 200 });
  }),

  // 상품 리뷰 핸들러 (456번 상품에 대해 에러)
  http.get("/api/products/:productId/reviews", async ({ params }) => {
    const { productId } = params;
    await delay(500);

    if (productId === "456") {
      return HttpResponse.json(
        { message: "리뷰를 불러오는 데 실패했습니다." },
        { status: 500 }
      );
    }

    return HttpResponse.json(productReviews, { status: 200 });
  }),

  // 상품 찜 정보 핸들러
  http.get("/api/products/:productId/wish", async () => {
    await delay(500);
    return HttpResponse.json(productWishInfo, { status: 200 });
  }),
];
