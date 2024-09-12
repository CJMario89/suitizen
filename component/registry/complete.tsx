import { Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getAnimationStyle } from "./animation-style";
import useGetCard from "@/hooks/use-get-card";
import Image from "next/image";

const Complete = ({ step }: { step: number }) => {
  const { data, refetch } = useGetCard();
  const card = data?.[0];
  useEffect(() => {
    if (step === 3) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
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
        Congratulations! You are now a Suitizen.
      </Heading>
      <Image
        src={card?.cardImg ?? ""}
        alt="Suitizen Card"
        width={300}
        height={450}
      />
      <Button
        size="md"
        boxShadow="0px 0px 5px #afd6ff"
        onClick={() => {
          window.location.reload();
        }}
      >
        Go to App
      </Button>
    </Flex>
  );
};

export default Complete;
