import OrderButton from "./OrderConfirmComponent/OrderButton";

interface OrderConfirmSectionProps {
  quantity: string;
  totalPrice: number;
  productName: string;
  sender: string;
  message: string;
  onOrderClick: () => void;
  isOrdering: boolean;
}

const OrderConfirmSection = ({
  quantity,
  totalPrice,
  productName,
  sender,
  message,
  onOrderClick,
  isOrdering,
}: OrderConfirmSectionProps) => {
  return (
    <OrderButton
      quantity={quantity}
      totalPrice={totalPrice}
      productName={productName}
      sender={sender}
      message={message}
      onOrderClick={onOrderClick}
      isOrdering={isOrdering}
    />
  );
};

export default OrderConfirmSection;
