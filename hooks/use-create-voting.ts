import { ModalContext } from "@/component/common/error-modal";
import { packNewInteractionTxb } from "@/sui-api";
import { UseDisclosureProps } from "@chakra-ui/react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

type CreateNewVoting = {
  cardId: string;
  title: string;
  description: string;
  options: string[];
};

type UseCreateVotingProps = UseMutationOptions<any, Error, CreateNewVoting>;

const useCreateVoting = (options: UseCreateVotingProps) => {
  const errorDisclosure = useContext<UseDisclosureProps>(ModalContext);
  const { mutateAsync } = useSignAndExecuteTransactionBlock({
    onError: (e) => {
      if (!e.message.includes("Rejected from user")) {
        errorDisclosure.onOpen?.();
      }
    },
  });
  return useMutation({
    mutationFn: async ({
      title,
      cardId,
      description,
      options,
    }: {
      title: string;
      cardId: string;
      description: string;
      options: string[];
    }) => {
      const ptb = await packNewInteractionTxb(
        cardId,
        0,
        title,
        description,
        options
      );

      return await mutateAsync({
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
    },
    ...options,
  });
};

export default useCreateVoting;
