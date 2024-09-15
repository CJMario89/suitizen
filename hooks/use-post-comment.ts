import { ModalContext } from "@/component/common/error-modal";
import { packDiscussTxb, refreshInteractionData } from "@/sui-api";
import { UseDisclosureProps } from "@chakra-ui/react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

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
      await mutateAsync({
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
      await refreshInteractionData();
      return;
    },
    ...options,
  });
};

export default usePostComment;
