import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { getAnimationStyle } from "./animation-style";
import useGetFacialData from "@/hooks/use-get-facial-data";

export const videoWidth = 300;
export const videoHeight = 300;

export default function FaceDetectionBlock({
  step,
  onSuccess,
}: {
  step: number;
  onSuccess: (facialContent: string) => void;
}) {
  const {
    mutate: getFacialData,
    isIdle,
    isSuccess,
  } = useGetFacialData({
    onSuccess: (data) => {
      onSuccess(JSON.stringify(data));
    },
  });

  return (
    <Flex
      position="absolute"
      w="full"
      flexDirection="column"
      gap="8"
      h="full"
      bg="darkTheme.700"
      justifyContent="center"
      p="4"
      alignItems="center"
      {...getAnimationStyle(1, step)}
    >
      {isIdle && (
        <Flex alignItems="center" justifyContent="center">
          <Button
            alignSelf="center"
            onClick={() => {
              getFacialData();
            }}
            bg="primary.300"
            color="white"
          >
            Scan
          </Button>
        </Flex>
      )}
      <Flex
        w="full"
        h="full"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        zIndex={isIdle ? "-1" : "1"}
      >
        <Flex
          w="full"
          h="full"
          position="relative"
          display={isSuccess ? "none" : "flex"}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            height={`${videoHeight}px`}
            width={`${videoWidth}px`}
            overflow="hidden"
            borderRadius="full"
            position="relative"
          >
            <video
              id="video"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: `${videoHeight}px`,
                width: `${videoWidth}px`,
                transform: "scaleX(-1)",
              }}
            />
          </Box>

          <canvas
            width="700"
            height="700"
            id="overlay"
            style={{
              zIndex: 1,
              position: "absolute",
              height: "350px",
              width: "350px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
