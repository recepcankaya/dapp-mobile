import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  return { isLoading, setLoading };
};

export default useLoading;
