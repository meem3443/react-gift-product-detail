import { ThemeCard } from "./Cards/ThemeCard";
import { getThemes, type Theme } from "../../api/theme";
import { useNavigate } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ThemeSection = () => {
  const navigate = useNavigate();

  const handleThemeClick = (themeId: number) => {
    navigate(`/themes/${themeId}/products`);
  };

  const { data: themes } = useSuspenseQuery<Theme[], Error>({
    queryKey: ["themes"],
    queryFn: getThemes,
    staleTime: 1000 * 5,
  });

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
