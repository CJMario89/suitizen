import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import cardTemplate from "@/assets/suitizen-card.png";

const name = "Paulwu.sui";
const Canvas = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = `${process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR}/8hxbG1k235VOe51eovi8wub4JLS8XC_TjIauqBcFz-g`;
      image.onload = () => {
        // draw an image in an independent canvas
        // output the blob to remove background API

        const template = new Image();
        template.src = cardTemplate.src;
        template.onload = () => {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(template, 0, 0, 512, 512);
          ctx.drawImage(image, 122, 43, 268, 268);

          //draw a bottom line
          ctx.beginPath();
          ctx.moveTo(142, 365);
          ctx.lineTo(370, 365);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(0, 0, 0, 1)";
          ctx.stroke();

          // draw text
          ctx.font =
            name.length < 12
              ? "bold 40px serif"
              : name.length < 18
              ? "bold 32px serif"
              : name.length < 24
              ? "bold 24px serif"
              : "bold 18px serif";
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.textAlign = "center";
          ctx.fillText(name, 256, 360);

          ctx.font = "14px serif";
          ctx.textAlign = "left";
          ctx.fillText("Last Name:", 122, 420);
          ctx.fillText("First Name:", 122, 445);
          ctx.fillText("Birth:", 122, 470);
          ctx.fillText(name, 190, 420);
          ctx.fillText(name, 190, 445);
          ctx.fillText(name, 157, 470);
        };
      };
    }
  }, []);
  return (
    <Flex w="full" h="full" alignItems="center" justifyContent="center" p="36">
      <Box w="512px" h="512px">
        <canvas
          width="512"
          height="512"
          style={{ border: "1px solid black" }}
        />
      </Box>
    </Flex>
  );
};

export default Canvas;
