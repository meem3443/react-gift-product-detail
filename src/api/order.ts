import apiClient from "./index";
import { setAuthToken } from "./index";

export interface ReceiverDetail {
  name: string;
  phoneNumber: string;
  quantity: number;
}

export interface OrderRequestPayload {
  productId: number;
  message: string;
  messageCardId: string;
  ordererName: string;
  receivers: ReceiverDetail[];
}

export interface OrderResponseData {
  success: boolean;
}

/**
 * 주문하기 API를 호출합니다.
 * @param payload 주문 상세 정보
 * @param authToken 로그인 응답에서 받은 인증 토큰
 * @returns 주문 성공 시 응답 데이터
 * @throws Error HTTP 오류 (특히 401 Unauthorized) 또는 네트워크 오류
 */
export const orderApi = async (
  payload: OrderRequestPayload,
  authToken: string
): Promise<OrderResponseData> => {
  try {
    setAuthToken(authToken);

    const data = (await apiClient.post<OrderResponseData>(
      "/api/order",
      payload
    )) as unknown as OrderResponseData;

    console.log(data);
    return data;
  } catch (error) {
    console.error("Order API Error:", error);
    throw error;
  } finally {
    setAuthToken(null);
  }
};
