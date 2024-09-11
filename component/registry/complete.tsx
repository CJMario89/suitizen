import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { getAnimationStyle } from "./animation-style";
import useGetCard from "@/hooks/use-get-card";

const Complete = ({ step }: { step: number }) => {
  const { data } = useGetCard();
  return (
    <Flex
      position="absolute"
      w="full"
      flexDirection="column"
      gap="8"
      h="full"
      bg="darkTheme.700"
      justifyContent="space-between"
      p="4"
      {...getAnimationStyle(3, step)}
    >
      <Heading size="md" color="white">
        Your Card is Ready!
      </Heading>
    </Flex>
  );
};

export default Complete;
