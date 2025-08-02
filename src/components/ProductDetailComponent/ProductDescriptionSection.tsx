import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProductDetail } from "../../api/product";
import { getProductDetail } from "../../api/product";

const ProductDescription = ({ description }: { description: string }) => (
  <div className="p-4 bg-white shadow-md rounded-b-lg">
    <h2 className="text-xl font-bold mb-4">상품설명</h2>
    <div
      dangerouslySetInnerHTML={{ __html: description }}
      className="prose max-w-none"
    />
  </div>
);

export const ProductDescriptionSection = ({
  productId,
}: {
  productId: number;
}) => {
  const { data: productDetail } = useSuspenseQuery<ProductDetail, Error>({
    queryKey: ["productDetail", productId],
    queryFn: () => getProductDetail(productId),
    retry: false,
  });

  return <ProductDescription description={productDetail.description} />;
};
