import { Box, Button, Flex, Heading, Skeleton } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAnimationStyle } from "./animation-style";
import useGetCard, { Card } from "@/hooks/use-get-card";
import Image from "next/image";
import { getUserSuitizenCard, refreshInteractionData } from "@/sui-api";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Complete = ({ step }: { step: number }) => {
  const [card, setCard] = useState<Card>();
  const currentAccount = useCurrentAccount();
  const { refetch, data } = useGetCard({
    enabled: false,
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (step === 4 && currentAccount?.address) {
      (async () => {
        const data = await getUserSuitizenCard(currentAccount?.address);

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
      {...getAnimationStyle(4, step)}
    >
      <Heading size="md" color="white">
        Congratulations! You are now a Suitizen.
      </Heading>
      {!card && (
        <Skeleton w="256px" h="256px" borderRadius="lg" alignSelf="center" />
      )}
      {!!card && (
        <Box w="256px" h="256px" alignSelf="center">
          {!loaded && <Skeleton w="256px" h="256px" borderRadius="lg" />}
          <Image
            src={card?.cardImg ?? ""}
            onLoadingComplete={() => {
              setLoaded(true);
            }}
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
          refetch();
        }}
        alignSelf="self-end"
      >
        Go to App
      </Button>
    </Flex>
  );
};

export default Complete;
