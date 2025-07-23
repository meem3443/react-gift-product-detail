interface ReceiverDetail {
  name: string;

  phoneNumber: string;
  quantity: number;
}

interface OrderRequestPayload {
  productId: number;
  message: string;

  messageCardId: string;

  ordererName: string;
  receivers: ReceiverDetail[];
}

interface OrderResponseData {
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
    const response = await fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED_ORDER");
    }

    if (!response.ok) {
      const errorData: { message?: string } = await response.json();

      throw new Error(errorData.message || "주문 요청에 실패했습니다.");
    }

    const result: { data: OrderResponseData } = await response.json();
    return result.data;
  } catch (error) {
    console.error("Order API Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("네트워크 오류 또는 알 수 없는 오류가 발생했습니다.");
  }
};
