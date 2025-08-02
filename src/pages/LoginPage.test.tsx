import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";

import { useNavigate } from "react-router-dom";
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("react-toastify", () => {
  const toast = Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  });
  return {
    __esModule: true,
    toast,
    ToastContainer: () => null,
  };
});

import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthContextType, User } from "../contexts/AuthContext";

let mockLogin: Mock<(email: string, password: string) => Promise<void>>;
let mockLogout: Mock<() => void>;
let mockNavigate: Mock<(to: string) => void>;
let mockToastError: Mock<(message: string, options?: object) => void>;
let mockNotify: Mock<(message: string) => void>;

let getItemSpy: ReturnType<typeof vi.spyOn>;

function clearAllMocks() {
  mockLogin.mockClear();
  mockLogout.mockClear();
  mockNavigate.mockClear();
  mockToastError.mockClear();
  mockNotify.mockClear();
  getItemSpy.mockClear();
}

const renderLoginPage = (authContextValue?: Partial<AuthContextType>) => {
  const defaultAuthContextValue: AuthContextType = {
    user: null,
    authToken: null,
    login: mockLogin,
    logout: mockLogout,
  };
  render(
    <AuthContext.Provider
      value={{ ...defaultAuthContextValue, ...authContextValue }}
    >
      <LoginPage />
    </AuthContext.Provider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    // 로그인 함수에 딜레이 추가 - isSubmitting 상태 테스트를 위해 필요
    mockLogin = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );
    mockLogout = vi.fn();
    mockNavigate = vi.fn();
    mockToastError = vi.fn();
    mockNotify = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(toast).mockImplementation(mockNotify);
    vi.mocked((toast as any).error).mockImplementation(mockToastError);

    getItemSpy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
    vi.spyOn(localStorage, "setItem").mockImplementation(vi.fn());
    vi.spyOn(localStorage, "removeItem").mockImplementation(vi.fn());

    clearAllMocks();
  });

  it("로그인 페이지 요소들이 올바르게 렌더링되고, 버튼은 초기 비활성화 상태입니다.", () => {
    renderLoginPage();

    expect(screen.getByText("kakao")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("이메일")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호")).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: "로그인" });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();

    expect(
      screen.queryByText(/이메일을 입력해주세요/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/@kakao.com 형식의 이메일만 입력 가능합니다/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/비밀번호를 입력해주세요/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/비밀번호는 8자 이상이어야 합니다/i)
    ).not.toBeInTheDocument();
  });

  it("이미 로그인되어 있으면 홈('/')으로 즉시 이동합니다.", async () => {
    const mockUser: User = { email: "test@kakao.com", name: "테스트유저" };

    getItemSpy.mockImplementation((key) => {
      if (key === "authToken") return "mock-token-abc";
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    });

    renderLoginPage({
      user: mockUser,
      authToken: "mock-token-abc",
      login: mockLogin,
      logout: mockLogout,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("이메일 필드에 잘못된 도메인이 입력되면 오류 메시지를 표시합니다.", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("이메일");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    await user.type(emailInput, "invalid@example.com");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(
        screen.getByText("@kakao.com 형식의 이메일만 입력 가능합니다.")
      ).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });
  });

  it("비밀번호가 8자 미만일 때 오류 메시지를 표시합니다.", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const passwordInput = screen.getByPlaceholderText("비밀번호");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    await user.type(passwordInput, "short");
    await user.tab(); // fireEvent.blur 대신 userEvent.tab() 사용

    await waitFor(() => {
      expect(
        screen.getByText("비밀번호는 8자 이상이어야 합니다.")
      ).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });
  });

  it("모든 입력이 유효할 때 로그인 버튼이 활성화됩니다.", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("이메일");
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    expect(loginButton).toBeDisabled();

    await user.type(emailInput, "valid@kakao.com");
    await user.type(passwordInput, "validpassword");

    await waitFor(() => {
      expect(loginButton).toBeEnabled();
    });
  });

  it("'로그인' 버튼 클릭 시 '로그인 중...' 상태를 올바르게 표시합니다.", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // 유효한 정보 입력
    await user.type(screen.getByPlaceholderText("이메일"), "valid@kakao.com");
    await user.type(screen.getByPlaceholderText("비밀번호"), "validpassword");

    // 버튼이 활성화된 것을 확인하고 클릭
    const loginButton = screen.getByRole("button", { name: "로그인" });
    await waitFor(() => expect(loginButton).toBeEnabled());
    await user.click(loginButton);

    // Promise가 해결되기 전, "로그인 중..." 텍스트를 확인
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "로그인 중..." })
      ).toBeInTheDocument();
    });
  });

  it("유효한 자격 증명으로 로그인 성공 시 홈으로 이동합니다.", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // 유효한 정보 입력
    await user.type(screen.getByPlaceholderText("이메일"), "valid@kakao.com");
    await user.type(screen.getByPlaceholderText("비밀번호"), "validpassword");

    // 버튼 클릭
    const loginButton = screen.getByRole("button", { name: "로그인" });
    await waitFor(() => expect(loginButton).toBeEnabled());
    await user.click(loginButton);

    // Promise가 해결된 후, navigate 함수가 올바른 경로로 호출되었는지 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
