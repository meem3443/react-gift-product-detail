import axios, { type AxiosResponse } from "axios";

export interface ApiResponseWrapper<T> {
  data: T;
}

interface ApiErrorData {
  status: string;
  statusCode: number;
  message: string;
}

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

apiClient.interceptors.response.use(
  <T>(
    response: AxiosResponse<ApiResponseWrapper<T>>
  ): AxiosResponse<ApiResponseWrapper<T>> => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorResponseData = error.response.data as ApiErrorResponseWrapper;
      const errorDetails = errorResponseData?.data;

      const status = error.response.status;
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
      return Promise.reject(
        new Error("네트워크 오류가 발생했습니다. 서버에 연결할 수 없습니다.")
      );
    } else {
      return Promise.reject(
        new Error("요청 설정 중 알 수 없는 오류가 발생했습니다.")
      );
    }
  }
);

export default apiClient;
