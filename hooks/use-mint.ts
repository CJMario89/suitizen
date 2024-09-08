import { packMintTxb } from "@/sui-api";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UseMintProps = UseMutationOptions<
  void,
  Error,
  {
    faceId: string;
    pfpId: string;
    cardId: string;
    nameId: string;
    index: number;
  }
>;

const useMint = ({
  faceId,
  pfpId,
  cardId,
  nameId,
  index,
}: {
  faceId?: string;
  pfpId?: string;
  cardId?: string;
  nameId?: string;
  index: number;
} & UseMintProps) => {
  const { mutateAsync } = useSignAndExecuteTransactionBlock();

  return useMutation({
    mutationFn: async () => {
      console.log("minting", nameId, pfpId, cardId, faceId, index);
      if (!nameId || !pfpId || !cardId || !faceId) {
        throw new Error("Missing required fields");
      }
      const ptb = await packMintTxb(nameId, index, pfpId, cardId, faceId);
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
  });
};

export default useMint;
