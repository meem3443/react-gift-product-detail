import { LikeCard } from "./Cards/LikeCard";

export const ProductDetailBardSection = () => {
  const onClick = () => {
    window.alert("hello!");
  };

  return (
    <div className="w-full mx-auto flex">
      <div className="h-full">
        <LikeCard category={`10`} img="/heart.svg" onClick={onClick}></LikeCard>
      </div>

      <button className="w-full bg-yellow-400 text-black text-lg font-bold">
        구매하기
      </button>
    </div>
  );
};
