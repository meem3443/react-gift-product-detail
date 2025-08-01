import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./contexts/AuthProvider";
import { Header } from "./components/common/Header";
import GiftOrderPage from "./pages/GiftOrderPage";
import { ThemeProductsPage } from "./pages/ThemeProductPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GiftDetailPage } from "./pages/GiftDetailPage";
import { Suspense } from "react";

import ErrorBoundary from "./components/common/ErrorBoundary";
import AppLoadingSpinner from "./components/common/AppLoadingSpinner";
import AppFallbackErrorUI from "./components/common/AppFallbackErrorUI";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      onError: (error: Error) => {
        console.error(
          "Mutation Error:",
          error.message || "알 수 없는 뮤테이션 오류"
        );
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<AppFallbackErrorUI />}>
        <Router>
          <AuthProvider>
            <div className="w-2xl h-screen bg-gray-100 mx-auto ">
              <Header />
              <Suspense fallback={<AppLoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/order/:productId" element={<GiftOrderPage />} />
                  <Route
                    path="/themes/:themeId/products"
                    element={<ThemeProductsPage />}
                  />
                  <Route
                    path="/product/:productId"
                    element={<GiftDetailPage />}
                  />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
