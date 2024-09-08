import { packVoteTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

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
  const { mutateAsync } = useSignAndExecuteTransactionBlock();
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
