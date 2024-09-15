import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { getAnimationStyle } from "./animation-style";
import useGetFacialData from "@/hooks/use-get-facial-data";
import usePrepareScanning from "@/hooks/use-prepare-scannig";
import Image from "next/image";
import Loading from "/assets/loading.gif";
import { Gender } from "face-api.js";

export const videoWidth = 300;
export const videoHeight = 300;

export default function FaceDetectionBlock({
  step,
  onSuccess,
}: {
  step: number;
  onSuccess: (facialContent: string, gender: Gender) => void;
}) {
  const {
    mutate: getFacialData,
    isIdle,
    isSuccess,
    hint,
  } = useGetFacialData({
    onSuccess: (data) => {
      onSuccess(JSON.stringify(data), data.gender);
    },
  });

  const { isPending: isPreparing } = usePrepareScanning();

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
      {isPreparing && (
        <Flex
          w="full"
          h="full"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="4"
        >
          <Heading as="h4">Preparing for scannig</Heading>
          <Image src={Loading} alt="loading" width="80" height="80" />
        </Flex>
      )}
      {isIdle && !isPreparing && (
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
          {hint && (
            <Text
              position="absolute"
              top={{ base: "4px", md: "12" }}
              color="white"
              bg="blackAlpha.700"
              p="2"
              borderRadius="md"
            >
              {hint}
            </Text>
          )}
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
