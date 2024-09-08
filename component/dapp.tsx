import useGetCard from "@/hooks/use-get-card";
import React from "react";
import Registry from "./registry";
import Image from "next/image";
import Proposal from "./proposal";
import { Box, Flex } from "@chakra-ui/react";

const Dapp = () => {
  const { data, isPending } = useGetCard();
  const isSuitizen = !!data?.length && data?.length > 0;
  return (
    <Flex w="full" h="full" flexDirection="column" gap="2" alignItems="center">
      {isSuitizen && <Proposal />}
      {!isSuitizen && !isPending && <Registry />}
      <Box h="512px" w="512px">
        <canvas id="canvas" width="512" height="512" />
      </Box>
    </Flex>
  );
};

export default Dapp;
