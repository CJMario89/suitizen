import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import styles from "./animation.module.css";

const BackgroundAnimation = () => {
  // a box shadow ball that moves around the screen and changes color and size
  useEffect(() => {
    const box = document.getElementById("deco");
    if (box) {
      const move = () => {
        // const x = Math.random() * 0.01 + box.style.left;
        // const y = Math.random() * 0.01 + box.style.top;
        // const width = Math.random() * 0.01 + box.style.width;
        // const height = Math.random() * 0.01 + box.style.height;
        // box.style.left = `${x}px`;
        // box.style.top = `${y}px`;
        // box.style.width = `${width}px`;
        // box.style.height = `${height}px`;
      };
      move();
      requestAnimationFrame(move);
    }
  }, []);
  return (
    <Box
      w="full"
      h="full"
      top="0"
      left="0"
      position="fixed"
      zIndex="-1"
      bg="rgba(0, 0, 0, 0.8)"
      backdropFilter={"blur(50px)"}
    >
      <Box
        className={styles.glowBall}
        top="500px"
        left="500px"
        position="absolute"
        id="deco"
        zIndex="-2"
        borderRadius="full"
        transition="all 3s"
      />
    </Box>
  );
};

export default BackgroundAnimation;
