import apiClient from "./index"; // apiClient 인스턴스 임포트

export interface ProductPrice {
  basicPrice: number;
  sellingPrice: number;
  discountRate: number;
}

export interface BrandInfo {
  id: number;
  name: string;
  imageURL: string;
}

export interface Product {
  id: number;
  name: string;
  price: ProductPrice;
  imageURL: string;
  brandInfo: BrandInfo;
}

export type TargetType = "ALL" | "FEMALE" | "MALE" | "TEEN";
export type RankType = "MANY_WISH" | "MANY_RECEIVE" | "MANY_WISH_RECEIVE";

export interface AnnouncementItem {
  name: string;
  value: string;
  displayOrder: number;
}

export interface ProductDetail {
  description: string;
  announcement: AnnouncementItem[];
}

// 상품 랭킹 조회 API
export const getRankingProducts = async (
  targetType: TargetType,
  rankType: RankType
): Promise<Product[]> => {
  try {
    // apiClient.get의 반환 타입이 Product[] 임을 'as' 키워드로 단언합니다.
    const data = (await apiClient.get("/api/products/ranking", {
      params: { targetType, rankType },
    })) as Product[]; // <--- 이 부분이 핵심 수정!

    // 인터셉터가 이미 실제 데이터를 반환했으므로, data는 이미 Product[] 타입입니다.
    // 만약 data가 undefined라면 빈 배열 반환으로 방어
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch ranking products:`, error);
    throw error;
  }
};

// 상품 기본 정보 조회 API
export const getProductInfo = async (productId: number): Promise<Product> => {
  try {
    // apiClient.get의 반환 타입이 Product 임을 'as' 키워드로 단언합니다.
    const productInfo = (await apiClient.get(
      `/api/products/${productId}`
    )) as Product; // <--- 이 부분이 핵심 수정!
    return productInfo;
  } catch (error) {
    console.error(`Failed to fetch product info for ${productId}:`, error);
    throw error;
  }
};

// 상품 상세 정보 조회 API
export const getProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  try {
    // apiClient.get의 반환 타입이 ProductDetail 임을 'as' 키워드로 단언합니다.
    const productDetailData = (await apiClient.get(
      `/api/products/${productId}/detail`
    )) as ProductDetail; // <--- 이 부분이 핵심 수정!
    return productDetailData;
  } catch (error) {
    console.error(`Failed to fetch product detail for ${productId}:`, error);
    throw error;
  }
};
