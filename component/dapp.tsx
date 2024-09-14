import useGetCard from "@/hooks/use-get-card";
import React, { Dispatch, SetStateAction } from "react";
import Registry from "./registry";
import { Box, Flex } from "@chakra-ui/react";
import Profile from "./profile";
import { useAutoConnectWallet, useCurrentWallet } from "@mysten/dapp-kit";

const Dapp = ({ setPath }: { setPath: Dispatch<SetStateAction<string>> }) => {
  const autoConnectStatus = useAutoConnectWallet();
  const { connectionStatus } = useCurrentWallet();
  const { data, isPending } = useGetCard();
  const isSuitizen = !!data?.length && data?.length > 0;
  return (
    <Flex w="full" h="full" flexDirection="column" gap="2" alignItems="center">
      {isSuitizen && <Profile setPath={setPath} />}
      {!isSuitizen &&
        autoConnectStatus === "attempted" &&
        (!isPending || connectionStatus === "disconnected") && <Registry />}
      <Box h="512px" w="512px" display="none">
        <canvas id="canvas" width="512" height="512" />
      </Box>
    </Flex>
  );
};

export default Dapp;
