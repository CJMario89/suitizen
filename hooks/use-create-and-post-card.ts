import { getWalrus, postWalrus } from "@/walrus-api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import i2 from "@/assets/i-2.jpg";
import { createCard } from "@/create-card";
import { checkIndexExist } from "@/sui-api";
import { pd } from "@/pd";

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
    gender: string;
  }
>;

const useCreateAndPostCard = (options?: UseCreateAndPostCardPoOption) => {
  return useMutation({
    //@ts-ignore
    mutationFn: async ({
      facialContent,
      name,
      gender,
    }: {
      facialContent: string;
      name?: string;
      gender: string;
    }) => {
      if (!name) throw new Error("Name is required");

      //random pfp
      const index = await choosePFP({
        gender,
      });
      const pfpObjectId = pd[index - 1];

      // create card
      const [buffer, walrusFacialObject] = await Promise.all([
        createCard({ pfpId: pfpObjectId, name }),
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

async function choosePFP({ gender }: { gender: string }) {
  console.log(gender);
  // boy 1~100 girl 101~200
  const index =
    gender === "male"
      ? Math.floor(Math.random() * 100) + 1
      : Math.floor(Math.random() * 100) + 101;

  const isExist = await checkIndexExist(index);

  if (isExist) {
    return choosePFP({ gender });
  } else {
    return index;
  }
}

export default useCreateAndPostCard;
