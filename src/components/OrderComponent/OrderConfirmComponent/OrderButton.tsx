interface OrderButtonProps {
  quantity: string;
  totalPrice: number;
  productName: string;
  sender: string;
  message: string;
  onOrderClick: () => void;
  isOrdering: boolean;
}

const OrderButton = ({
  quantity,
  totalPrice,
  onOrderClick,
  isOrdering,
}: OrderButtonProps) => {
  const numericQuantity = parseInt(quantity, 10);

  const isButtonDisabled =
    numericQuantity <= 0 || isNaN(numericQuantity) || isOrdering;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white p-4 shadow-top">
      <button
        className={`
          bg-yellow-400 text-black rounded-lg shadow-md w-full max-w-lg px-8 py-3 text-lg font-bold
          ${
            isButtonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-yellow-500"
          }
        `}
        onClick={onOrderClick}
        disabled={isButtonDisabled}
      >
        {isOrdering
          ? "주문 중..."
          : `${totalPrice.toLocaleString()}원 구매하기 (${quantity}개)`}
      </button>
    </div>
  );
};

export default OrderButton;
