import { useEffect } from "react";

export const ErrorThrowingComponent = () => {
  useEffect(() => {
    throw new Error("의도적으로 발생시킨 에러입니다!");
  }, []);

  return null;
};
