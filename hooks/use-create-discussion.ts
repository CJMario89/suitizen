import { packNewProposalTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type CreateNewDiscussion = {
  cardId: string;
  title: string;
  description: string;
};

type UseCreateDiscussionProps = UseMutationOptions<
  any,
  Error,
  CreateNewDiscussion
>;

const useCreateDiscussion = (options: UseCreateDiscussionProps) => {
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
    }: {
      title: string;
      cardId: string;
      description: string;
    }) => {
      console.log("creating discussion", title, cardId, description);
      const ptb = await packNewProposalTxb(cardId, 1, title, description, []);
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

export default useCreateDiscussion;
