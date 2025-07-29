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
    // Axios의 post 메서드는 AxiosResponse 객체를 반환합니다.
    // 하지만 당신의 apiClient 인터셉터는 이미 data를 추출해서 반환하므로,
    // 여기서 그 반환값을 `LoginResponseData` 타입으로 단언해줍니다.
    const response = (await apiClient.post<LoginResponseData>("/api/login", {
      email,
      password,
    })) as unknown as LoginResponseData; // 👈 이 부분에서 `LoginResponseData`로 타입 단언

    console.log("Login API로부터 받은 응답:", response);

    // 'response'는 이제 LoginResponseData 타입으로 간주되므로, 직접 속성에 접근합니다.
    setAuthToken(response.authToken);

    // 'response'는 LoginResponseData 타입이므로, 바로 반환합니다.
    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
