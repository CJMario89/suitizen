import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";

const Canvas = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 400, 600);

      // Draw Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, 400, 600);
      gradient.addColorStop(0, "rgba(255, 179, 198, 0.5)");
      gradient.addColorStop(1, "rgba(179, 229, 255, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 600);

      // // Add some texture to the background
      // for (let i = 0; i < 20; i++) {
      //   ctx.beginPath();
      //   ctx.arc(
      //     Math.random() * 400,
      //     Math.random() * 600,
      //     Math.random() * 30 + 10,
      //     0,
      //     Math.PI * 2
      //   );
      //   ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      //   ctx.fill();
      // }

      // // Draw Name and Information Section
      // ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      // ctx.fillRect(50, 380, 300, 180);

      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#444";
      ctx.textAlign = "left";
      ctx.fillText("Name: CJMARIO", 70, 440);
      ctx.fillText("birth: Sep, 2024", 70, 480);
      ctx.fillText("A certification for Suitizen", 70, 520);

      // Function to draw a droplet shape
      const drawDroplet = (
        x: number,
        y: number,
        size: number,
        angle: number
      ) => {
        if (!ctx) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size, -size, size, 0);
        ctx.quadraticCurveTo(size / 2, size, 0, size * 2);
        ctx.quadraticCurveTo(-size / 2, size, -size, 0);
        ctx.quadraticCurveTo(-size, -size, 0, -size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Add some droplet textures to the background
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        const x = Math.random() * 400;
        const y = Math.random() * 600;
        const size = Math.random() * 30 + 10;
        const angle = Math.random() * Math.PI * 2;
        drawDroplet(x, y, size, angle);
      }

      // Draw a subtle border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, 400, 600);

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = `${process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR}/8hxbG1k235VOe51eovi8wub4JLS8XC_TjIauqBcFz-g`;
      image.onload = () => {
        // draw an image in an independent canvas
        // output the blob to remove background API

        const canvas1 = document.createElement("canvas");
        canvas1.width = 300;
        canvas1.height = 300;
        const ctx1 = canvas1.getContext("2d");
        if (!ctx1) return;
        ctx1.drawImage(image, 0, 0, 300, 300);
        canvas1.toBlob(async (blob) => {
          if (!blob) return;
          const imglyRemoveBackground = await import(
            "@imgly/background-removal"
          );
          console.log(imglyRemoveBackground);
          imglyRemoveBackground.removeBackground(blob).then((blob: Blob) => {
            console.log(blob);
            // result is a blob encoded as PNG.
            // It can be converted to an URL to be used as HTMLImage.src
            const url = URL.createObjectURL(blob);
            const img = new Image();

            img.src = url;
            img.onload = () => {
              ctx.drawImage(img, 50, 50, 300, 300);
            };
          });
        });
      };
      // Draw a image border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 5;
      ctx.strokeRect(50, 50, 300, 300);
    }
  }, []);
  return (
    <Flex w="full" h="full" alignItems="center" justifyContent="center" p="36">
      <Box w="400px" h="600px">
        <canvas
          width="400"
          height="600"
          style={{ border: "1px solid black" }}
        />
      </Box>
    </Flex>
  );
};

export default Canvas;
