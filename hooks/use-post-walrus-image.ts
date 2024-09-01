import { useMutation } from "@tanstack/react-query";

const usePostWalrusImage = () => {
  return useMutation({
    mutationFn: async (image: string) => {
      return await fetch("https://publisher-devnet.walrus.space/v1/store", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/json",
        },
        body: JSON.stringify({
          d: image,
        }),
      });
    },
  });
};

export default usePostWalrusImage;
