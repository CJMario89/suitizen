export const createCard1 = ({
  pfpId,
  name,
}: {
  pfpId: string;
  name: string;
}) => {
  return new Promise<Buffer>((resolve, reject) => {
    // const canvas = document.createElement("canvas");
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    canvas.width = 400;
    canvas.height = 600;
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

      // Add some droplet textures to the background and randomize their position without overlapping
      for (let i = 0; i < 20; i++) {
        // blue and pink droplets with two colors
        ctx.fillStyle =
          Math.random() > 0.5
            ? "rgba(255, 179, 198, 0.5)"
            : "rgba(179, 229, 255, 1)";

        // without overlapping logic
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const size = Math.random() * 10 + 10;
        const angle = Math.random() * Math.PI;
        drawDroplet(x, y, size, angle);
      }

      // Draw a linear gradient image border with pink blue color
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 5;
      // Draw a linear gradient image border with pink blue color
      const gradient2 = ctx.createLinearGradient(50, 400, 350, 550);
      gradient2.addColorStop(0, "rgba(179, 229, 255, 1)");
      gradient2.addColorStop(1, "rgba(255, 179, 198, 0.5)");
      ctx.strokeStyle = gradient2;
      ctx.lineWidth = 5;
      // ctx.strokeRect(50, 400, 300, 150);
      ctx.strokeRect(50, 45, 300, 310);
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, 400, 600);

      //radial gradient  in the background
      const gradient1 = ctx.createRadialGradient(200, 300, 0, 200, 300, 300);
      gradient1.addColorStop(0, "rgba(179, 229, 255, 0)");
      gradient1.addColorStop(1, "rgba(179, 229, 255, 0.1)");
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, 400, 600);

      // beautiful  font family
      ctx.font = "16px cursive";
      ctx.fillStyle = "#444";
      ctx.textAlign = "left";
      ctx.fillText("Last name:", 100, 430);
      ctx.fillText("First name:", 100, 460);
      ctx.fillText("Birth:", 100, 490);
      ctx.fillText("Citizen No.", 100, 520);
      ctx.fillText("Cetification for Suitizen", 120, 550);
      ctx.fillText(name, 220, 430);
      ctx.fillText("Sui", 220, 460);
      ctx.fillText("Sep, 2024", 220, 490);
      ctx.fillText("123", 220, 520);

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
              canvas.toBlob(async (blob) => {
                if (blob) {
                  console.log(blob);
                  resolve(Buffer.from(await blob.arrayBuffer()));
                } else {
                  reject("Failed to convert canvas to blob");
                }
              });
            };
          });
        });
      };
    }
  });
};
