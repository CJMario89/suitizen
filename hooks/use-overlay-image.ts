import { useMutation } from "@tanstack/react-query";
const useOnverLayImage = () => {
  return useMutation({
    mutationFn: async (index: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const image1 = new Image();
      const image2 = new Image();
      image1.src = "./i-2.jpg";
      image1.onload = function () {
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);

        image2.src = "./i-1.png";
        image2.onload = async function () {
          ctx.drawImage(
            image2,
            canvas.width / 4,
            canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2
          );

          ctx.font = "24px serif";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";

          ctx.fillText(
            "Hello, Canvas!",
            canvas.width - 100,
            canvas.height - 20
          );

          const image = canvas.toDataURL("image/png");

          const link = document.createElement("a");
          link.href = image;
          link.download = "canvas_image.png";
          link.click();
          return image;
        };
      };
    },
  });
};

export default useOnverLayImage;
