import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { getAnimationStyle } from "./animation-style";
import useMint from "@/hooks/use-mint";
import Image from "next/image";
import Loading from "/assets/loading.gif";

const Mint = ({
  step,
  faceId,
  pfpId,
  cardId,
  nameId,
  index,
  isPreparing,
  onSuccess,
}: {
  step: number;
  faceId?: string;
  pfpId?: string;
  cardId?: string;
  nameId?: string;
  index: number;
  isPreparing: boolean;
  onSuccess: () => void;
}) => {
  const {
    mutate: mint,
    isPending,
    data,
  } = useMint({
    faceId,
    pfpId,
    cardId,
    nameId,
    index,
    onSuccess: () => {
      onSuccess();
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
      alignItems="center"
      p="4"
      {...getAnimationStyle(3, step)}
    >
      {isPreparing ? (
        <Flex
          w="full"
          h="full"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="4"
        >
          <Heading as="h4">Preparing your Suitizen</Heading>
          <Image src={Loading} alt="loading" width="80" height="80" />
        </Flex>
      ) : (
        <Flex w="full" h="full" alignItems="center" flexDirection="column">
          <Heading>Mint your Suitizen</Heading>
          <Button
            mt="40"
            isLoading={isPending}
            onClick={() => {
              mint();
            }}
          >
            Mint
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Mint;
