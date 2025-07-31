import apiClient, { type ApiResponseWrapper } from "./index";

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
  announcements: AnnouncementItem[];
}

export interface WishInfo {
  wishCount: number;
  isWished: boolean;
}

export interface HighlightReview {
  id: string;
  authorName: string;
  content: string;
}

export interface HighlightReviewsResponse {
  totalCount: number;
  reviews: HighlightReview[];
}

export interface ProductSummary {
  id: number;
  name: string;
  brandName: string;
  price: number;
  imageURL: string;
}

/**
 * 상품 랭킹 조회 API
 * @param targetType 대상 타입 (ALL, FEMALE, MALE, TEEN)
 * @param rankType 랭킹 타입 (MANY_WISH, MANY_RECEIVE, MANY_WISH_RECEIVE)
 * @returns 상품 목록 (Product[])
 */
export const getRankingProducts = async (
  targetType: TargetType,
  rankType: RankType
): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<Product[]>>(
      "/api/products/ranking",
      {
        params: { targetType, rankType },
      }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch ranking products:`, error);
    throw error;
  }
};

/**
 * 상품 기본 정보 조회 API
 * @param productId 상품 ID
 * @returns 상품 기본 정보 (Product)
 */
export const getProductInfo = async (productId: number): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<Product>>(
      `/api/products/${productId}`
    );
    const productInfo = response.data.data;
    return productInfo;
  } catch (error) {
    console.error(`Failed to fetch product info for ${productId}:`, error);
    throw error;
  }
};

/**
 * 상품 상세 정보 조회 API
 * @param productId 상품 ID
 * @returns 상품 상세 정보 (ProductDetail)
 */
export const getProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<ProductDetail>>(
      `/api/products/${productId}/detail`
    );
    const productDetailData = response.data.data;
    return productDetailData;
  } catch (error) {
    console.error(`Failed to fetch product detail for ${productId}:`, error);
    throw error;
  }
};

/**
 * 상품 찜 정보 조회 API
 * @param productId 상품 ID
 * @returns 상품 찜 정보 (WishInfo)
 */
export const getProductWishInfo = async (
  productId: number
): Promise<WishInfo> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<WishInfo>>(
      `/api/products/${productId}/wish`
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(`Failed to fetch product wish info for ${productId}:`, error);
    throw error;
  }
};

/**
 * 상품 하이라이트 리뷰 조회 API
 * @param productId 상품 ID
 * @returns 상품 하이라이트 리뷰 목록 (HighlightReviewsResponse)
 */
export const getProductHighlightReviews = async (
  productId: number
): Promise<HighlightReviewsResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponseWrapper<HighlightReviewsResponse>
    >(`/api/products/${productId}/highlight-review`);
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch product highlight reviews for ${productId}:`,
      error
    );
    throw error;
  }
};

/**
 * 상품 요약 정보 조회 API
 * @param productId 상품 ID
 * @returns 상품 요약 정보 (ProductSummary)
 */
export const getProductSummary = async (
  productId: number
): Promise<ProductSummary> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<ProductSummary>>(
      `/api/products/${productId}/summary`
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(`Failed to fetch product summary for ${productId}:`, error);
    throw error;
  }
};
