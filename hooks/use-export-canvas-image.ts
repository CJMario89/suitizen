import { useMutation } from "@tanstack/react-query";

const useExportCanvasImage = () => {
  useMutation({
    mutationFn: async () => {
      const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
      if (!canvas) return;
      return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject("Failed to convert canvas to blob");
          }
        });
      });
    },
  });
};

export default useExportCanvasImage;
