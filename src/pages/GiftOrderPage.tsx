import { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";

import OrderConfirmSection from "../components/OrderComponent/OrderConfirmSection";
import ReceiverSection from "../components/OrderComponent/ReceiverSection";
import SenderSection from "../components/OrderComponent/SenderSection";
import ThanksCardSlideSection from "../components/OrderComponent/ThanksCardSlideSection";
import ProductDetailCard from "../components/OrderComponent/Cards/ProductDetailCard";

import { getProductInfo, type Product } from "../api/product";

import type { ReceiverField } from "../schemas/receiverSchema";
import { useAuth } from "../contexts/useAuth";
import { orderApi } from "../api/order";
import { UI_MESSAGES } from "../constants/message";

const GiftOrderPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const parsedProductId = productId ? parseInt(productId, 10) : undefined;

  const navigate = useNavigate();
  const { isLoggedIn, authToken, logout } = useAuth();
  const notify = useCallback((message: string) => toast(message), []);

  const [finalReceivers, setFinalReceivers] = useState<ReceiverField[]>([]);
  const [senderName, setSenderName] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");

  const getValidatedProductId = useCallback((): number => {
    if (parsedProductId === undefined || Number.isNaN(parsedProductId)) {
      throw new Error(UI_MESSAGES.PRODUCT_ID_MISSING);
    }
    return parsedProductId;
  }, [parsedProductId]);

  const { data: productInfo } = useSuspenseQuery<Product, Error>({
    queryKey: ["productInfo", parsedProductId],
    queryFn: () => getProductInfo(getValidatedProductId()),
    retry: false,
  });

  const totalQuantity = useMemo(() => {
    return finalReceivers.reduce((sum, receiver) => sum + receiver.quantity, 0);
  }, [finalReceivers]);

  const totalPrice = useMemo(() => {
    const unitPrice = productInfo.price.sellingPrice;
    return totalQuantity * unitPrice;
  }, [totalQuantity, productInfo]);

  const validateAuth = useCallback((): boolean => {
    if (!isLoggedIn) {
      notify(UI_MESSAGES.LOGIN_REQUIRED);
      navigate("/login");
      return false;
    }
    if (!authToken) {
      notify(UI_MESSAGES.AUTH_TOKEN_MISSING);
      logout();
      navigate("/login");
      return false;
    }
    return true;
  }, [isLoggedIn, authToken, logout, navigate, notify]);

  const validateOrderData = useCallback((): boolean => {
    if (totalQuantity <= 0) {
      notify(UI_MESSAGES.ORDER_QUANTITY_REQUIRED);
      return false;
    }
    if (finalReceivers.length === 0) {
      notify(UI_MESSAGES.RECEIVER_REQUIRED);
      return false;
    }
    if (!senderName) {
      notify(UI_MESSAGES.SENDER_NAME_REQUIRED);
      return false;
    }
    if (!messageContent) {
      notify(UI_MESSAGES.MESSAGE_CONTENT_REQUIRED);
      return false;
    }
    return true;
  }, [totalQuantity, finalReceivers, senderName, messageContent, notify]);

  const orderMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        productId: getValidatedProductId(),
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
            notify(
              `주문이 완료 되었습니다. \n 상품명: ${
                productInfo.name // productInfo는 이제 항상 유효합니다.
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

  const handleOrderSubmit = useCallback(() => {
    if (orderMutation.isPending) {
      return;
    }

    if (!validateAuth()) {
      return;
    }
    if (!validateOrderData()) {
      return;
    }

    orderMutation.mutate();
  }, [validateAuth, validateOrderData, orderMutation]);

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
