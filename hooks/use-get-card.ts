import { getUserSuitizenCard } from "@/sui-api";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type Card = {
  objectId: string;
  cardImg: string;
  faceFeature: string;
  firstName: string;
  lastName: string;
};

type UseGetCardProps = Omit<UseQueryOptions<Card[]>, "queryKey">;

const useGetCard = (options?: UseGetCardProps) => {
  const currentAccount = useCurrentAccount();
  return useQuery({
    queryKey: ["card", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No current account");
      return getUserSuitizenCard(currentAccount?.address);
    },
    ...options,
    enabled: !!currentAccount?.address && options?.enabled,
  });
};

export default useGetCard;
