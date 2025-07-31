import apiClient, { setAuthToken, type ApiResponseWrapper } from "./index";

interface LoginResponseData {
  email: string;
  name: string;
  authToken: string;
}

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponseData> => {
  try {
    const response = await apiClient.post<
      ApiResponseWrapper<LoginResponseData>
    >("/api/login", {
      email,
      password,
    });
    const loginData = response.data.data;

    console.log("Login API로부터 받은 응답:", loginData);

    setAuthToken(loginData.authToken);
    return loginData;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
