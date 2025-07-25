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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="w-2xl h-screen bg-gray-100 mx-auto ">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/order/:productId" element={<GiftOrderPage />} />
              <Route
                path="/themes/:themeId/products"
                element={<ThemeProductsPage />}
              />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
