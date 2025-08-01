import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProductDetail, AnnouncementItem } from "../../api/product";
import { getProductDetail } from "../../api/product";

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

export const ProductDetailsInfoSection = ({
  productId,
}: {
  productId: number;
}) => {
  const { data: productDetail } = useSuspenseQuery<ProductDetail, Error>({
    queryKey: ["productDetail", productId],
    queryFn: () => getProductDetail(productId),
    retry: false,
  });

  return <ProductDetailsInfo announcements={productDetail.announcements} />;
};
