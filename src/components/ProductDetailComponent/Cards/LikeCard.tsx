interface LikeCardProps {
  category?: string;
  img?: string;
  onClick: () => void;
}

export const LikeCard = ({
  category = "기본 카테고리",
  img = "https://img1.daumcdn.net/thumb/S104x104/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fgift%2Fhome%2Ftheme%2F292020231106_MXMUB.png",
  onClick,
}: LikeCardProps) => {
  return (
    <div
      className="w-10 h-10 flex flex-col items-center rounded-xl cursor-pointer"
      onClick={onClick}
    >
      <img
        src={img}
        alt={category}
        className="w-1/2 h-1/2 object-contain rounded-xl"
      />

      <a className="text-xs text-black text-center w-15 ">{category}</a>
    </div>
  );
};
