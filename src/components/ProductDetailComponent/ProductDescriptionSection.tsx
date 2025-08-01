// src/components/ProductDetailComponent/ProductDescriptionSection.tsx

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
    queryFn: async () => {
      // productId가 123일 경우에만 에러를 강제로 발생시킵니다.
      if (productId === 123) {
        // 로딩 상태를 확인하기 위해 딜레이를 추가할 수 있습니다.
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("상품 상세 정보를 불러오는 데 실패했습니다.");
      }
      // 그 외의 경우는 정상적으로 API를 호출합니다.
      return getProductDetail(productId);
    },
    retry: false,
  });

  return <ProductDescription description={productDetail.description} />;
};
