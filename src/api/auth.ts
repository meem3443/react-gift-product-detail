import apiClient, { setAuthToken } from "./index";

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
    const response = (await apiClient.post<LoginResponseData>("/api/login", {
      email,
      password,
    })) as unknown as LoginResponseData;

    console.log("Login API로부터 받은 응답:", response);

    setAuthToken(response.authToken);

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
