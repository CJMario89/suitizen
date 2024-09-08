import ConnectButton from "@/component/common/connect-button";
import Dapp from "@/component/dapp";
import { Box } from "@chakra-ui/react";
import { useAutoConnectWallet, useCurrentWallet } from "@mysten/dapp-kit";

export const getStaticProps = async () => {
  return {
    props: {
      title: "Dapp",
    },
  };
};

const DappPage = () => {
  const { connectionStatus } = useCurrentWallet();
  const autoConnectStatus = useAutoConnectWallet();
  return (
    <Box display={autoConnectStatus === "idle" ? "none" : "flex"}>
      {connectionStatus === "connected" ? <Dapp /> : <ConnectButton />}
    </Box>
  );
};

export default DappPage;
