import { useSuspenseQuery } from "@tanstack/react-query";
import type { HighlightReviewsResponse } from "../../api/product";
import { getProductHighlightReviews } from "../../api/product";

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

export const ProductReviewsSection = ({ productId }: { productId: number }) => {
  const { data: productReviews } = useSuspenseQuery<
    HighlightReviewsResponse,
    Error
  >({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductHighlightReviews(productId),
    retry: false,
  });

  return (
    <ProductReviews
      reviews={productReviews.reviews}
      totalCount={productReviews.totalCount}
    />
  );
};
