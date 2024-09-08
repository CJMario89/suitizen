import { packNewProposalTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type CreateNewVoting = {
  cardId: string;
  title: string;
  description: string;
  options: string[];
};

type UseCreateVotingProps = UseMutationOptions<any, Error, CreateNewVoting>;

const useCreateVoting = (options: UseCreateVotingProps) => {
  const { mutateAsync } = useSignAndExecuteTransactionBlock({
    onError: (error) => {
      console.error("Error signing and executing transaction block", error);
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
      console.log("creating voting", title, cardId, description);
      const ptb = await packNewProposalTxb(
        cardId,
        0,
        title,
        description,
        options
      );
      console.log("ptb", ptb);
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
