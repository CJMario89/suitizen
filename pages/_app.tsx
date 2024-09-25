import "@/styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import getTheme from "../theme";
import Header from "@/component/header";
import {
  createNetworkConfig,
  lightTheme,
  SuiClientProvider,
  Theme,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";
import React, { useState } from "react";
import BackgroundAnimation from "@/component/common/background-animation";
import { ErrorModalProvider } from "@/component/common/error-modal";
React.useLayoutEffect = React.useEffect;
export default function App({
  Component,
  pageProps,
}: AppProps & { Component: { noWallet: boolean } }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
  const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
  });
  const [path, setPath] = useState("/");

  return (
    <ChakraProvider theme={getTheme()}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <ErrorModalProvider>
              <Flex minH="100vh" flexDirection="column">
                <Header path={path} setPath={setPath} />
                <Component {...pageProps} setPath={setPath} path={path} />
              </Flex>
            </ErrorModalProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
