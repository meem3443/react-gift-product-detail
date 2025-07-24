import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderConfirmSection from "../components/OrderComponent/OrderConfirmSection";
import ReceiverSection from "../components/OrderComponent/ReceiverSection";
import SenderSection from "../components/OrderComponent/SenderSection";
import ThanksCardSlideSection from "../components/OrderComponent/ThanksCardSlideSection";

import ProductDetailCard from "../components/OrderComponent/Cards/ProductDetailCard";

import {
  getProductDetail,
  getProductInfo,
  type Product,
  type ProductDetail as ProductDetailType,
} from "../api/product";

import type { ReceiverField } from "../schemas/receiverSchema";
import { useAuth } from "../contexts/useAuth";
import { orderApi } from "../api/order";
import { UI_MESSAGES } from "../constants/message";

const GiftOrderPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, authToken, logout } = useAuth();
  const notify = (message: string) => toast(message);

  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const [, setProductDetailsFull] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [finalReceivers, setFinalReceivers] = useState<ReceiverField[]>([]);

  const [senderName, setSenderName] = useState<string>("");

  const [messageContent, setMessageContent] = useState<string>("");

  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  useEffect(() => {
    if (!productId) {
      setError(UI_MESSAGES.PRODUCT_ID_MISSING);
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const id = parseInt(productId, 10);

        const [info, detail] = await Promise.all([
          getProductInfo(id),
          getProductDetail(id),
        ]);

        setProductInfo(info);
        setProductDetailsFull(detail);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          navigate("/");
        } else {
          setError(UI_MESSAGES.PRODUCT_INFO_FETCH_ERROR);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, navigate]);

  const totalQuantity = useMemo(() => {
    return finalReceivers.reduce((sum, receiver) => sum + receiver.quantity, 0);
  }, [finalReceivers]);

  const totalPrice = useMemo(() => {
    if (!productInfo) return 0;
    const unitPrice = productInfo.price.sellingPrice;
    return totalQuantity * unitPrice;
  }, [totalQuantity, productInfo]);

  const handleOrderSubmit = async () => {
    if (isOrdering) return;

    console.log("현재 authToken:", authToken);
    console.log("현재 isLoggedIn:", isLoggedIn);
    if (!isLoggedIn) {
      notify(UI_MESSAGES.LOGIN_REQUIRED);
      navigate("/login");
      return;
    }
    if (!authToken) {
      notify(UI_MESSAGES.AUTH_TOKEN_MISSING);
      logout();
      navigate("/login");
      return;
    }
    if (totalQuantity <= 0) {
      notify(UI_MESSAGES.ORDER_QUANTITY_REQUIRED);
      return;
    }
    if (!productInfo) {
      notify(UI_MESSAGES.PRODUCT_INFO_LOADING);
      return;
    }
    if (finalReceivers.length === 0) {
      notify(UI_MESSAGES.RECEIVER_REQUIRED);
      return;
    }
    if (!senderName) {
      notify(UI_MESSAGES.SENDER_NAME_REQUIRED);
      return;
    }
    if (!messageContent) {
      notify(UI_MESSAGES.MESSAGE_CONTENT_REQUIRED);
      return;
    }

    setIsOrdering(true);

    try {
      const payload = {
        productId: parseInt(productId!, 10),
        message: messageContent,
        messageCardId: "default-card-id",
        ordererName: senderName,
        receivers: finalReceivers.map((rec) => ({
          name: rec.name,
          phoneNumber: rec.phone,
          quantity: rec.quantity,
        })),
      };

      console.log("전송될 주문 페이로드:", JSON.stringify(payload, null, 2));

      const result = await orderApi(payload, authToken);

      if (result.success) {
        toast.success(UI_MESSAGES.ORDER_SUCCESS, {
          onClose: () => {
            alert(
              `주문이 완료 되었습니다. \n 상품명: ${
                productInfo!.name
              } \n 구매 수량: ${totalQuantity}\n 발신자 이름: ${senderName}\n 메시지: ${messageContent}`
            );
            navigate("/");
          },
        });
      } else {
        notify(UI_MESSAGES.ORDER_FAIL_API_RESPONSE);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === UI_MESSAGES.UNAUTHORIZED_ORDER) {
          toast.error(UI_MESSAGES.SESSION_EXPIRED, {
            onClose: () => {
              logout();
              navigate("/login");
            },
          });
        } else {
          toast.error(`${UI_MESSAGES.ORDER_GENERIC_FAIL}${error.message}`, {
            onClose: () => navigate("/"),
          });
        }
      } else {
        toast.error(UI_MESSAGES.ORDER_FAIL_UNKNOWN);
      }
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-gray-700">
        {UI_MESSAGES.PRODUCT_INFO_LOADING.replace("...", " 중...")}{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-red-700">
        오류: {error}
      </div>
    );
  }

  if (!productInfo) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-gray-700">
        {UI_MESSAGES.PRODUCT_NOT_FOUND}
      </div>
    );
  }

  const handleReceiversUpdate = (receivers: ReceiverField[]) => {
    setFinalReceivers(receivers);
    console.log("최종 받는 사람 목록 업데이트됨:", receivers);
  };

  const handleReceiverCancel = () => {
    console.log("Receiver 컴포넌트에서 취소되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-4 pb-[80px]">
      <ThanksCardSlideSection onMessageChange={setMessageContent} />
      <SenderSection onSenderNameChange={setSenderName} />
      <ReceiverSection
        onReceiversUpdate={handleReceiversUpdate}
        onCancel={handleReceiverCancel}
      />
      <ProductDetailCard
        imageUrl={productInfo.imageURL}
        productName={productInfo.name}
        brand={productInfo.brandInfo.name}
        price={productInfo.price.sellingPrice}
      />

      <OrderConfirmSection
        totalPrice={totalPrice}
        quantity={totalQuantity.toString()}
        productName={productInfo.name}
        sender={senderName}
        message={messageContent}
        onOrderClick={handleOrderSubmit}
        isOrdering={isOrdering}
      />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default GiftOrderPage;
