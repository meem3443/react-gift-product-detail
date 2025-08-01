import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../../contexts/AuthContext";
import { SortOptionSection } from "./SortOptionSection";

const mockLogin = vi.fn<(email: string, password: string) => Promise<void>>();
const mockLogout = vi.fn<() => void>();

const queryClient = new QueryClient();

const authLoggedIn: AuthContextType = {
  user: { email: "test@kakao.com", name: "테스트유저" },
  authToken: "mock-token",
  login: mockLogin,
  logout: mockLogout,
};

describe("SortOptionSection", () => {
  let mockNavigate: ReturnType<typeof vi.fn>;

  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
    return {
      ...actual,
      useNavigate: vi.fn(),
    };
  });

  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("초기 렌더 시 랭킹 데이터가 보인다", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authLoggedIn}>
          <QueryClientProvider client={queryClient}>
            <SortOptionSection />
          </QueryClientProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("스트로베리 초콜릿 생크림")).toBeInTheDocument();
    });
  });
});
