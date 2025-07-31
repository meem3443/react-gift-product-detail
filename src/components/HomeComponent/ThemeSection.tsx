import { ThemeCard } from "./Cards/ThemeCard";
import { getThemes, type Theme } from "../../api/theme";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const ThemeSection = () => {
  const navigate = useNavigate();

  const handleThemeClick = (themeId: number) => {
    navigate(`/themes/${themeId}/products`);
  };

  const {
    data: themes,
    isLoading,
    isError,
    error,
  } = useQuery<Theme[], Error>({
    queryKey: ["themes"],
    queryFn: getThemes,
    staleTime: 1000 * 5,
  });

  if (isLoading) {
    return (
      <div className="bg-white w-full h-auto p-5 pb-10 text-center">
        <p className="text-xl pt-5 pb-5 pl-3 font-bold">선물 테마</p>
        <p>테마 로딩 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white w-full h-auto p-5 pb-10 text-center text-red-500">
        <p className="text-xl pt-5 pb-5 pl-3 font-bold">선물 테마</p>

        <p>오류 발생: {error?.message || "알 수 없는 오류"}</p>
      </div>
    );
  }

  if (!themes || themes.length === 0) {
    return (
      <div className="bg-white w-full h-auto p-5 pb-10 text-center text-gray-600">
        <p className="text-xl pt-5 pb-5 pl-3 font-bold">선물 테마</p>
        <p>표시할 테마가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-auto p-5 pb-10 ">
      <p className="text-xl pt-5 pb-5 pl-3 font-bold">선물 테마</p>
      <div className="w-full h-48 mx-auto grid grid-cols-5 gap-4 justify-items-center ">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.themeId}
            category={theme.name}
            img={theme.image}
            onClick={() => handleThemeClick(theme.themeId)}
          />
        ))}
      </div>
    </div>
  );
};
