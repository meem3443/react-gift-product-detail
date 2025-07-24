import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const nickname = user?.email ? user.email.split("@")[0] : "사용자";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">로그인 정보 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold mb-8">마이 페이지</h1>
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-96 text-center">
        <p className="text-2xl font-semibold mb-4">{nickname}님 안녕하세요!</p>

        <p className="text-lg text-gray-700 mb-6">
          이메일 주소는 {user.email}입니다.
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full text-lg"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
