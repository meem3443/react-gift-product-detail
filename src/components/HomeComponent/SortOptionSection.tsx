import { useState } from "react";
import { ImgBox } from "../common/ImgBox";
import { RankingProductList } from "./RankingProductList";
import {
  getRankingProducts,
  type TargetType,
  type RankType,
  type Product,
} from "../../api/product";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { FILTER_OPTIONS, SORT_OPTIONS } from "../../constants/rankingOptions";

import { useQuery } from "@tanstack/react-query";

export const SortOptionSection = () => {
  const [activeFilter, setActiveFilter] = useState<TargetType>("ALL");
  const [activeSort, setActiveSort] = useState<RankType>("MANY_WISH");

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const {
    data: rankingProducts,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["rankingProducts", activeFilter, activeSort],

    queryFn: () => getRankingProducts(activeFilter, activeSort),
  });

  const handleProductClick = (productId: number) => {
    if (isLoggedIn) {
      navigate(`/order/${productId}`);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-white py-4 px-6">
      <div className="flex justify-around items-start mb-6">
        {FILTER_OPTIONS.map((option) => (
          <div key={option.id}>
            <ImgBox
              category={option.label}
              img={option.img}
              isActive={activeFilter === option.id}
              onClick={() => setActiveFilter(option.id)}
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-3 flex justify-around items-center">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`
              flex-1 py-2 text-sm font-medium rounded-md
              transition duration-200 ease-in-out
              ${
                activeSort === option.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }
            `}
            onClick={() => setActiveSort(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4">현재 랭킹</h3>
        <RankingProductList
          products={rankingProducts || []}
          loading={isLoading}
          error={error}
          onProductClick={handleProductClick}
          isNumVisibleOption={true}
        />
        {/* ⭐ 로딩 및 에러 상태를 직접 렌더링하고 싶다면 아래와 같이 추가할 수 있습니다.
             RankingProductList 컴포넌트가 이미 로딩/에러를 처리하는 것으로 보입니다. */}
      </div>
    </div>
  );
};
