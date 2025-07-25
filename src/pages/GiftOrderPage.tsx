import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation } from "@tanstack/react-query";

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

  const [finalReceivers, setFinalReceivers] = useState<ReceiverField[]>([]);
  const [senderName, setSenderName] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");

  // 🔥 React Query 이용, product info/detail 쿼리
  const enabled = !!productId;
  const parsedProductId = productId ? parseInt(productId, 10) : undefined;

  const {
    data: productInfo,
    isLoading: isInfoLoading,
    error: infoError,
  } = useQuery<Product, Error>({
    queryKey: ["productInfo", parsedProductId],
    enabled,
    queryFn: () => getProductInfo(parsedProductId!),
    retry: false,
  });

  useQuery<ProductDetailType, Error>({
    queryKey: ["productDetail", parsedProductId],
    enabled,
    queryFn: () => getProductDetail(parsedProductId!),
    retry: false,
    // 실제로 product detail을 써먹는 부분 있으면 data 꺼내서 사용!
  });

  const totalQuantity = useMemo(() => {
    return finalReceivers.reduce((sum, receiver) => sum + receiver.quantity, 0);
  }, [finalReceivers]);

  const totalPrice = useMemo(() => {
    if (!productInfo) return 0;
    const unitPrice = productInfo.price.sellingPrice;
    return totalQuantity * unitPrice;
  }, [totalQuantity, productInfo]);

  // 주문 mutation
  const orderMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        productId: parsedProductId!,
        message: messageContent,
        messageCardId: "default-card-id",
        ordererName: senderName,
        receivers: finalReceivers.map((rec) => ({
          name: rec.name,
          phoneNumber: rec.phone,
          quantity: rec.quantity,
        })),
      };
      return orderApi(payload, authToken!);
    },
    onSuccess: (result) => {
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
    },
    onError: (error: Error) => {
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
    },
  });

  // 주문 로직 (버튼 등에서 호출)
  const handleOrderSubmit = () => {
    if (orderMutation.isPending) return;

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
    orderMutation.mutate();
  };

  if (!productId) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-red-700">
        {UI_MESSAGES.PRODUCT_ID_MISSING}
      </div>
    );
  }

  if (isInfoLoading) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-gray-700">
        {UI_MESSAGES.PRODUCT_INFO_LOADING.replace("...", " 중...")}{" "}
      </div>
    );
  }

  if (infoError) {
    return (
      <div className="container mx-auto py-10 text-center text-xl font-bold text-red-700">
        오류: {infoError.message}
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

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-4 pb-[80px]">
      <ThanksCardSlideSection onMessageChange={setMessageContent} />
      <SenderSection onSenderNameChange={setSenderName} />
      <ReceiverSection
        onReceiversUpdate={setFinalReceivers}
        onCancel={() => {}}
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
        isOrdering={orderMutation.isPending}
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
