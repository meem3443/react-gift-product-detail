import { useState, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { Product, WishInfo } from "../api/product";

import { getProductInfo, getProductWishInfo } from "../api/product";
import { ProductDetailBarSection } from "../components/ProductDetailComponent/ProductDetailBarSection";
import ErrorBoundary from "../components/common/ErrorBoundary";
import AppLoadingSpinner from "../components/common/AppLoadingSpinner";
import AppFallbackErrorUI from "../components/common/AppFallbackErrorUI";
import { ProductDescriptionSection } from "../components/ProductDetailComponent/ProductDescriptionSection";
import { ProductReviewsSection } from "../components/ProductDetailComponent/ProductReviewsSection";
import { ProductDetailsInfoSection } from "../components/ProductDetailComponent/ProductDetailsInfoSection";
import { ErrorThrowingComponent } from "../components/common/ErrorThrowingComponent.tsx";

export const GiftDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const parsedProductId = productId ? parseInt(productId, 10) : undefined;
  const [activeTab, setActiveTab] = useState<string>("description");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getValidatedProductId = (): number => {
    if (!parsedProductId) {
      throw new Error("유효한 상품 ID가 필요합니다.");
    }
    return parsedProductId;
  };

  const { data: productInfo } = useSuspenseQuery<Product, Error>({
    queryKey: ["productInfo", parsedProductId],
    queryFn: () => getProductInfo(getValidatedProductId()),
    retry: false,
  });

  const { data: productWishInfo } = useSuspenseQuery<WishInfo, Error>({
    queryKey: ["productWishInfo", parsedProductId],
    queryFn: () => getProductWishInfo(getValidatedProductId()),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-[80px]">
      <img
        src={productInfo.imageURL}
        alt={productInfo.name}
        className="w-full h-auto object-cover"
      />
      <div className="p-3 bg-white border-b border-gray-200">
        <p className="font-black text-2xl">{productInfo.name}</p>
        <p className="font-black text-xl text-blue-600">
          {productInfo.price.sellingPrice.toLocaleString()}원
        </p>
      </div>
      <div className="flex items-center bg-white w-full p-3 border-b border-gray-200">
        <img
          className="w-6 h-6 rounded-full mr-2"
          src={productInfo.brandInfo.imageURL}
          alt={productInfo.brandInfo.name}
        />
        <p className="font-bold text-lg text-gray-800">
          {productInfo.brandInfo.name}
        </p>
      </div>
      <div className="flex bg-gray-200 mt-4 rounded-t-lg overflow-hidden shadow-md">
        <button
          className={`flex-1 py-3 text-center font-semibold text-lg transition-colors duration-200 ${
            activeTab === "description"
              ? "bg-white text-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabClick("description")}
        >
          상품설명
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold text-lg transition-colors duration-200 ${
            activeTab === "reviews"
              ? "bg-white text-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabClick("reviews")}
        >
          상품후기
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold text-lg transition-colors duration-200 ${
            activeTab === "details"
              ? "bg-white text-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabClick("details")}
        >
          상세정보
        </button>
      </div>
      <div>
        {activeTab === "description" && (
          <ErrorBoundary fallback={<AppFallbackErrorUI />}>
            <Suspense fallback={<AppLoadingSpinner />}>
              <ProductDescriptionSection productId={parsedProductId!} />
              {/* <ErrorThrowingComponent />  //에러테스트 해보시기 좋게
              추가해놨습니다! */}
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === "reviews" && (
          <ErrorBoundary fallback={<AppFallbackErrorUI />}>
            <Suspense fallback={<AppLoadingSpinner />}>
              <ProductReviewsSection productId={parsedProductId!} />
              {/* <ErrorThrowingComponent />  //에러테스트 해보시기 좋게
              추가해놨습니다! */}
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === "details" && (
          <ErrorBoundary fallback={<AppFallbackErrorUI />}>
            <Suspense fallback={<AppLoadingSpinner />}>
              <ProductDetailsInfoSection productId={parsedProductId!} />
              {/* <ErrorThrowingComponent />  //에러테스트 해보시기 좋게
              추가해놨습니다! */}
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <ProductDetailBarSection
        initialWishCount={productWishInfo.wishCount}
        initialIsWished={productWishInfo.isWished}
        productId={parsedProductId!}
      />
    </div>
  );
};
