import axios, { type AxiosResponse } from "axios";

// 1. 성공 응답을 감싸는 표준 래퍼 인터페이스 정의
// T는 실제 API별 응답 데이터의 타입이 됩니다.
interface ApiResponseWrapper<T> {
  data: T;
}

// 2. 에러 응답의 실제 데이터 구조 정의
interface ApiErrorData {
  status: string;
  statusCode: number;
  message: string;
}

// 3. 에러 응답을 감싸는 표준 래퍼 인터페이스 정의
interface ApiErrorResponseWrapper {
  data: ApiErrorData;
}

const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let authAxiosToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authAxiosToken = token;
};

// 요청 인터셉터: JWT 토큰을 Authorization 헤더에 추가합니다.
apiClient.interceptors.request.use(
  (config) => {
    if (authAxiosToken) {
      config.headers.Authorization = authAxiosToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 서버 응답에서 실제 데이터를 추출하고, 에러를 처리합니다.
apiClient.interceptors.response.use(
  // 성공 응답 처리: AxiosResponse<ApiResponseWrapper<T>>를 받아서 T를 반환합니다.
  <T>(
    response: AxiosResponse<ApiResponseWrapper<T>> // 서버로부터 받는 원본 응답의 타입
  ): T => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data.data; // 실제 데이터를 반환
    }
    // 예외적인 경우 (서버 응답 구조가 명세서와 다를 때)
    console.warn(
      "API response structure is not as expected. Returning raw response.data as T."
    );
    return response.data as T; // 원시 response.data를 T로 캐스팅하여 반환
  },
  // 에러 응답 처리
  (error) => {
    if (error.response) {
      // 에러 응답도 { "data": { status, statusCode, message } } 형태이므로, data.data에 접근
      const errorResponseData = error.response.data as ApiErrorResponseWrapper;
      const errorDetails = errorResponseData?.data; // 내부 'data' 속성에 접근

      const status = error.response.status;
      // 에러 메시지는 errorDetails.message에서 가져오고, 없으면 기본 메시지 사용
      const message =
        errorDetails?.message || "알 수 없는 오류가 발생했습니다.";

      console.error(
        `API Error - Status: ${status}, Message:`,
        message,
        errorDetails
      );

      if (status === 401) {
        return Promise.reject(new Error("UNAUTHORIZED_ORDER"));
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // 요청은 되었으나 응답을 받지 못함 (네트워크 오류, 서버 접속 불가 등)
      return Promise.reject(
        new Error("네트워크 오류가 발생했습니다. 서버에 연결할 수 없습니다.")
      );
    } else {
      // 요청 설정 중 오류 발생
      return Promise.reject(
        new Error("요청 설정 중 알 수 없는 오류가 발생했습니다.")
      );
    }
  }
);

export default apiClient;
