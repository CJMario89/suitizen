import { packDiscussTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UsePostCommentProps = UseMutationOptions<
  any,
  Error,
  {
    content: string;
    cardId: string;
    proposalId: string;
  }
>;

const usePostComment = (options?: UsePostCommentProps) => {
  const { mutateAsync } = useSignAndExecuteTransactionBlock();
  return useMutation({
    mutationFn: async ({
      content,
      cardId,
      proposalId,
    }: {
      content: string;
      cardId: string;
      proposalId: string;
    }) => {
      if (!content || !cardId || !proposalId) {
        throw new Error("Missing required fields");
      }
      console.log("posting comment", proposalId, cardId, content);
      const ptb = await packDiscussTxb(proposalId, cardId, content);
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

export default usePostComment;
