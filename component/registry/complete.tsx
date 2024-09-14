import { Box, Button, Flex, Heading, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getAnimationStyle } from "./animation-style";
import useGetCard, { Card } from "@/hooks/use-get-card";
import Image from "next/image";
import { getUserSuitizenCard, refreshInteractionData } from "@/sui-api";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Complete = ({ step }: { step: number }) => {
  const [card, setCard] = useState<Card>();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (step === 3 && currentAccount?.address) {
      (async () => {
        const data = await getUserSuitizenCard(currentAccount?.address);
        console.log(currentAccount?.address);

        const retry = async () => {
          const data = await getUserSuitizenCard(currentAccount?.address);
          if (data?.length === 0) {
            setTimeout(retry, 1000);
          }
          setCard(data?.[0]);
        };
        if (data?.length === 0) {
          setTimeout(retry, 1000);
        }

        setCard(data?.[0]);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, currentAccount?.address]);
  console.log(card?.cardImg);
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
      {!card && (
        <Skeleton w="256px" h="256px" borderRadius="lg" alignSelf="center" />
      )}
      {!!card && (
        <Box w="256px" h="256px" alignSelf="center">
          <Image
            src={card?.cardImg ?? ""}
            alt="Suitizen Card"
            width={512}
            height={512}
          />
        </Box>
      )}
      <Button
        size="md"
        boxShadow="0px 0px 5px #afd6ff"
        onClick={() => {
          window.location.reload();
        }}
        alignSelf="self-end"
      >
        Go to App
      </Button>
    </Flex>
  );
};

export default Complete;
