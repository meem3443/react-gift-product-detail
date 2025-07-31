import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import type {
  Product,
  ProductDetail,
  HighlightReviewsResponse,
  AnnouncementItem,
  WishInfo,
} from "../api/product";

import {
  getProductDetail,
  getProductHighlightReviews,
  getProductInfo,
  getProductWishInfo,
} from "../api/product";
import { ProductDetailBarSection } from "../components/ProductDetailComponent/ProductDetailBarSection";

const ProductDescription = ({ description }: { description: string }) => (
  <div className="p-4 bg-white shadow-md rounded-b-lg">
    <h2 className="text-xl font-bold mb-4">상품설명</h2>
    <div
      dangerouslySetInnerHTML={{ __html: description }}
      className="prose max-w-none"
    />
  </div>
);

const ProductReviews = ({
  reviews,
  totalCount,
}: {
  reviews: HighlightReviewsResponse["reviews"];
  totalCount: number;
}) => (
  <div className="p-4 bg-white shadow-md rounded-b-lg">
    <h2 className="text-xl font-bold mb-4">상품후기 ({totalCount})</h2>
    {reviews && reviews.length > 0 ? (
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b pb-4 last:border-b-0 last:pb-0"
          >
            <p className="font-semibold text-gray-800">{review.authorName}</p>
            <p className="text-gray-600 mt-1">{review.content}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">아직 작성된 후기가 없습니다.</p>
    )}
  </div>
);

const ProductDetailsInfo = ({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-b-lg">
      <h2 className="text-xl font-bold mb-4">상세정보</h2>

      {announcements && announcements.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <tbody>
            {announcements.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 text-sm font-semibold text-gray-700 w-1/3 border-r">
                  {item.name}
                </td>
                <td className="py-2 px-4 text-sm text-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: item.value }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">표시할 상세 정보(공지사항)가 없습니다.</p>
      )}
    </div>
  );
};

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

  const { data: productDetail } = useSuspenseQuery<ProductDetail, Error>({
    queryKey: ["productDetail", parsedProductId],
    queryFn: () => getProductDetail(getValidatedProductId()),
    retry: false,
  });

  const { data: productReviews } = useSuspenseQuery<
    HighlightReviewsResponse,
    Error
  >({
    queryKey: ["productReviews", parsedProductId],
    queryFn: () => getProductHighlightReviews(getValidatedProductId()),
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
          상품후기 ({productReviews.totalCount || 0})
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
          <ProductDescription description={productDetail.description} />
        )}
        {activeTab === "reviews" && (
          <ProductReviews
            reviews={productReviews.reviews}
            totalCount={productReviews.totalCount}
          />
        )}
        {activeTab === "details" && (
          <ProductDetailsInfo announcements={productDetail.announcements} />
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
