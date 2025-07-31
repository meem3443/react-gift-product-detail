import { useState, useEffect } from "react";
import { LikeCard } from "./Cards/LikeCard";
import { useNavigate } from "react-router-dom";

interface ProductDetailBarSectionProps {
  initialWishCount: number;
  initialIsWished: boolean;
  productId: number;
}

export const ProductDetailBarSection = ({
  initialWishCount,
  initialIsWished,
  productId,
}: ProductDetailBarSectionProps) => {
  const [isWished, setIsWished] = useState<boolean>(initialIsWished);
  const [wishCount, setWishCount] = useState<number>(initialWishCount);
  const navigate = useNavigate();

  useEffect(() => {
    setIsWished(initialIsWished);
    setWishCount(initialWishCount);
  }, [initialIsWished, initialWishCount]);

  const handleLikeClick = () => {
    const newIsWished = !isWished;
    setIsWished(newIsWished);
    setWishCount((prevCount) => (newIsWished ? prevCount + 1 : prevCount - 1));
    console.log(
      `찜 상태 변경: ${newIsWished ? "찜함" : "찜 취소"}, 찜 개수: ${
        newIsWished ? wishCount + 1 : wishCount - 1
      }`
    );
  };

  const handleBuyClick = () => {
    navigate(`/order/${productId}`);
  };

  const heartIconSrc = isWished ? "/heart_fill.svg" : "/heart.svg";

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 shadow-lg z-10">
      <div className="max-w-screen-md mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LikeCard
            category={wishCount.toLocaleString()}
            img={heartIconSrc}
            onClick={handleLikeClick}
          />
        </div>

        <button
          className="flex-grow bg-yellow-400 text-black text-lg font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors ml-4"
          onClick={handleBuyClick}
        >
          구매하기
        </button>
      </div>
    </div>
  );
};
