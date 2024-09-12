import { getWalrus, postWalrus } from "@/walrus-api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import i2 from "@/assets/i-2.jpg";
import { createCard1 } from "@/create-card";

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
        createCard1({ pfpId: "", name }),
        postWalrus({ content: facialContent, type: "application/json" }),
      ]);
      // const buffer = await createCard({ image: pfpImage, name });
      console.log(buffer);
      // post card and facial content

      const [walrusCardObject] = await Promise.all([
        postWalrus({
          content: buffer,
          type: "image/jpg",
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

async function createCard({
  image,
  name,
}: {
  image: HTMLImageElement;
  name: string;
}) {
  return new Promise<Buffer>((resolve, reject) => {
    image.onload = function () {
      const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas not found");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Context not found");
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.font = "24px cursive";
      ctx.fillStyle = "#1a88ff";
      ctx.fillStyle = "#0066cc";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width - 100, canvas.height / 2);

      canvas.toBlob(async (blob) => {
        if (blob) {
          resolve(Buffer.from(await blob.arrayBuffer()));
        } else {
          reject("Failed to convert canvas to blob");
        }
      });
    };
  });
}

async function choosePFP() {
  return "8hxbG1k235VOe51eovi8wub4JLS8XC_TjIauqBcFz-g";
}

export default useCreateAndPostCard;
