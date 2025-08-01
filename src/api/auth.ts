import apiClient, { setAuthToken } from "./index";
import { type AxiosResponse } from "axios";

interface LoginResponseData {
  email: string;
  name: string;
  authToken: string;
}

interface ApiResponse<T> {
  data: T;
}

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponseData> => {
  try {
    const response: AxiosResponse<ApiResponse<LoginResponseData>> =
      await apiClient.post("/api/login", { email, password });

    setAuthToken(response.data.data.authToken);
    return response.data.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
