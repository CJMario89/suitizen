import { getWalrus, postWalrus } from "@/walrus-api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import i2 from "@/assets/i-2.jpg";
import { createCard } from "@/create-card";

type UseCreateAndPostCardPoOption = UseMutationOptions<
  {
    pfpId: string;
    walrusCardId: string;
    walrusFacialId: string;
  },
  Error,
  {
    facialContent: string;
    name?: string;
  }
>;

const useCreateAndPostCard = (options?: UseCreateAndPostCardPoOption) => {
  return useMutation({
    //@ts-ignore
    mutationFn: async ({
      facialContent,
      name,
    }: {
      facialContent: string;
      name?: string;
    }) => {
      if (!name) throw new Error("Name is required");

      //random pfp
      const pfpObjectId = await choosePFP();

      const pfpImage = new Image();
      pfpImage.crossOrigin = "anonymous";
      pfpImage.src = `${process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR}/${pfpObjectId}`;

      // create card
      const [buffer, walrusFacialObject] = await Promise.all([
        createCard({ pfpId: "", name }),
        postWalrus({ content: facialContent, type: "application/json" }),
      ]);
      // const buffer = await createCard({ image: pfpImage, name });
      console.log(buffer);
      // post card and facial content

      const [walrusCardObject] = await Promise.all([
        postWalrus({
          content: buffer,
          type: "image/png",
          query: "epochs=5",
        }),
      ]);
      console.log(pfpObjectId, walrusCardObject, walrusFacialObject);
      const pfpId = pfpObjectId;
      const walrusCardId =
        walrusCardObject?.newlyCreated?.blobObject?.blobId ??
        walrusCardObject?.alreadyCertified?.blobId;
      const walrusFacialId =
        walrusFacialObject?.newlyCreated?.blobObject?.blobId ??
        walrusFacialObject?.alreadyCertified?.blobId;
      //return and mint
      return {
        pfpId,
        walrusCardId,
        walrusFacialId,
      };
    },
    ...options,
  });
};

async function choosePFP() {
  return "8hxbG1k235VOe51eovi8wub4JLS8XC_TjIauqBcFz-g";
}

export default useCreateAndPostCard;
