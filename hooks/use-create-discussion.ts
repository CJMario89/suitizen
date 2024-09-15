import { ModalContext } from "@/component/common/error-modal";
import { packNewInteractionTxb } from "@/sui-api";
import { UseDisclosureProps } from "@chakra-ui/react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";

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
    }: {
      title: string;
      cardId: string;
      description: string;
    }) => {
      const ptb = await packNewInteractionTxb(
        cardId,
        1,
        title,
        description,
        []
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
      return result;
    },
    ...options,
  });
};

export default useCreateDiscussion;
