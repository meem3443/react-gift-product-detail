import apiClient from "./index";
import { type ApiResponseWrapper } from "./index";

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

export const getThemes = async (): Promise<Theme[]> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<Theme[]>>(
      "/api/themes"
    );

    const themes = response.data.data;

    console.log("getThemes API 응답:", themes);

    if (!Array.isArray(themes)) {
      console.error("API 응답이 예상된 배열 구조가 아닙니다.", themes);
      throw new Error("API 응답 데이터가 유효한 테마 목록이 아닙니다.");
    }

    return themes;
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    throw error;
  }
};

export const getThemeInfo = async (themeId: number): Promise<ThemeDetail> => {
  try {
    const response = await apiClient.get<ApiResponseWrapper<ThemeDetail>>(
      `/api/themes/${themeId}/info`
    );
    const themeInfo = response.data.data;
    return themeInfo;
  } catch (error) {
    console.error(`Failed to fetch theme info for ${themeId}:`, error);
    throw error;
  }
};

export const getThemeProducts = async (
  themeId: number,
  cursor: number = 0,
  limit: number = 10
): Promise<ThemeProductListResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponseWrapper<ThemeProductListResponse>
    >(`/api/themes/${themeId}/products`, { params: { cursor, limit } });
    const themeProducts = response.data.data;
    return themeProducts;
  } catch (error) {
    console.error(`Failed to fetch products for theme ${themeId}:`, error);
    throw error;
  }
};
