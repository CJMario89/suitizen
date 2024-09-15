import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { getAnimationStyle } from "./animation-style";
import useMint from "@/hooks/use-mint";

const Mint = ({
  step,
  faceId,
  pfpId,
  cardId,
  nameId,
  index,
  backups,
  onSuccess,
}: {
  step: number;
  faceId?: string;
  pfpId?: string;
  cardId?: string;
  nameId?: string;
  index: number;
  backups: string[];
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
    backup: backups,
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
      <Flex
        w="full"
        h="full"
        alignItems="center"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <Button
          alignSelf="flex-end"
          isLoading={isPending}
          onClick={() => {
            mint();
          }}
          className="gradient-border"
        >
          Generate your Suitizen Card
        </Button>
      </Flex>
    </Flex>
  );
};

export default Mint;
