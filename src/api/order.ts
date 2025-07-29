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

    // Axios의 post 메서드는 AxiosResponse 객체를 반환합니다.
    // 하지만 인터셉터에서 이미 실제 데이터만 추출하여 반환하므로,
    // 여기서 받는 'response' 변수는 이미 OrderResponseData 타입의 데이터입니다.
    // TypeScript가 이를 알도록 하기 위해 'unknown'을 거쳐 'OrderResponseData'로 안전하게 캐스팅합니다.
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
