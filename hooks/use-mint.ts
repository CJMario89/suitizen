import { ModalContext } from "@/component/common/error-modal";
import { packMintTxb } from "@/sui-api";
import { UseDisclosureProps } from "@chakra-ui/react";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

type UseMintProps = UseMutationOptions<any, Error, void>;

const useMint = ({
  faceId,
  pfpId,
  cardId,
  nameId,
  index,
  backup,
  ...options
}: {
  faceId?: string;
  pfpId?: string;
  cardId?: string;
  nameId?: string;
  index: number;
  backup: string[];
} & UseMintProps) => {
  const errorDisclosure = useContext<UseDisclosureProps>(ModalContext);
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

  const { mutateAsync } = useSignAndExecuteTransactionBlock({
    onError: (e) => {
      if (!e.message.includes("Rejected from user")) {
        errorDisclosure.onOpen?.();
      }
    },
  });

  return useMutation({
    mutationFn: async () => {
      if (!nameId || !pfpId || !cardId || !faceId || !currentAccount?.address) {
        throw new Error("Missing required fields");
      }
      const coin = await client.getBalance({
        owner: currentAccount?.address,
      });
      if (Number(coin.totalBalance) < 120000000) {
        errorDisclosure.onOpen?.();

        throw new Error("Insufficient funds");
      }
      const ptb = await packMintTxb(
        nameId,
        index,
        pfpId,
        cardId,
        faceId,
        Date.now(),
        backup
      );
      const result = await mutateAsync({
        transactionBlock: ptb,
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
          showRawInput: true,
        },
      });
      console.log("minted", result);
      return result;
    },
    ...options,
  });
};

export default useMint;
