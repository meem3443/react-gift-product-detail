import apiClient from "./index";

export interface Theme {
  themeId: number;
  name: string;
  image: string;
}

export interface ThemeDetail {
  themeId: number;
  name: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export interface ThemeProduct {
  id: number;
  name: string;
  price: {
    basicPrice: number;
    sellingPrice: number;
    discountRate: number;
  };
  imageURL: string;
  brandInfo: {
    id: number;
    name: string;
    imageURL: string;
  };
}

export interface ThemeProductListResponse {
  list: ThemeProduct[];
  cursor: number;
  hasMoreList: boolean;
}

// 테마 목록 조회 API
export const getThemes = async (): Promise<Theme[]> => {
  try {
    // apiClient.get의 반환 타입이 Theme[] 임을 'as' 키워드로 단언합니다.
    const themes = (await apiClient.get("/api/themes")) as Theme[]; // <--- 이 부분이 핵심 수정!
    return themes;
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    throw error;
  }
};

// 테마 상세 정보 조회 API
export const getThemeInfo = async (themeId: number): Promise<ThemeDetail> => {
  try {
    // apiClient.get의 반환 타입이 ThemeDetail 임을 'as' 키워드로 단언합니다.
    const themeInfo = (await apiClient.get(
      `/api/themes/${themeId}/info`
    )) as ThemeDetail; // <--- 이 부분이 핵심 수정!
    return themeInfo;
  } catch (error) {
    console.error(`Failed to fetch theme info for ${themeId}:`, error);
    throw error;
  }
};

// 테마 상품 목록 조회 API
export const getThemeProducts = async (
  themeId: number,
  cursor: number = 0,
  limit: number = 10
): Promise<ThemeProductListResponse> => {
  try {
    // apiClient.get의 반환 타입이 ThemeProductListResponse 임을 'as' 키워드로 단언합니다.
    const themeProducts = (await apiClient.get(
      `/api/themes/${themeId}/products`,
      { params: { cursor, limit } }
    )) as ThemeProductListResponse; // <--- 이 부분이 핵심 수정!
    return themeProducts;
  } catch (error) {
    console.error(`Failed to fetch products for theme ${themeId}:`, error);
    throw error;
  }
};
