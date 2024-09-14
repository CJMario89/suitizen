import { packTransferCardTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UseTransferBackupProps = UseMutationOptions<
  any,
  Error,
  {
    cardId: string;
    index: number;
  }
>;

const useTransferBackup = (options?: UseTransferBackupProps) => {
  const { mutateAsync } = useSignAndExecuteTransactionBlock();
  return useMutation({
    mutationFn: async ({
      cardId,
      index,
    }: {
      cardId: string;
      index: number;
    }) => {
      if (!cardId || typeof index === "undefined") {
        throw new Error("Missing required fields");
      }
      const ptb = await packTransferCardTxb(cardId, index);
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

export default useTransferBackup;
