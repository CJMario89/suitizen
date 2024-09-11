import Dapp from "@/component/dapp";

export const getStaticProps = async () => {
  return {
    props: {
      title: "Dapp",
    },
  };
};

const DappPage = () => {
  // const { connectionStatus } = useCurrentWallet();
  // const autoConnectStatus = useAutoConnectWallet();
  return <Dapp />;
};

export default DappPage;
