import useOnverLayImage from "@/hooks/use-overlay-image";
import { Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";

const OverlayImage = () => {
  const { mutate } = useOnverLayImage();
  return (
    <>
      <Button
        onClick={() => {
          mutate("1");
        }}
      >
        Generate
      </Button>
      <Text>Click the button to generate an overlay image</Text>
    </>
  );
};

export default OverlayImage;
