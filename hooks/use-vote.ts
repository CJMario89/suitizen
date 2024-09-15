import { ModalContext } from "@/component/common/error-modal";
import { packVoteTxb } from "@/sui-api";
import { UseDisclosureProps } from "@chakra-ui/react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

type UseVoteProps = UseMutationOptions<
  any,
  Error,
  {
    voteOption: number;
    cardId: string;
    proposalId: string;
  }
>;

const useVote = (options?: UseVoteProps) => {
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
      voteOption,
      cardId,
      proposalId,
    }: {
      voteOption: number;
      cardId: string;
      proposalId: string;
    }) => {
      if (typeof voteOption !== "number" || !cardId || !proposalId) {
        throw new Error("Missing required fields");
      }
      const ptb = await packVoteTxb(proposalId, cardId, voteOption);
      return mutateAsync({
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

export default useVote;
