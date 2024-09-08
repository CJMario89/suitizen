import { getUserSuiNS } from "@/sui-api";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type NameService = {
  domainName: string;
  objectId: string;
  imageUrl: string;
};

type UseGetNameServiceProps = Omit<UseQueryOptions<NameService[]>, "queryKey">;

const useGetNameService = (options?: UseGetNameServiceProps) => {
  const currentAccount = useCurrentAccount();

  const query = useQuery({
    queryKey: ["name-service", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) {
        throw new Error("No current account");
      }
      return (await getUserSuiNS(currentAccount.address)) as NameService[];
    },
    ...options,
    enabled: !!currentAccount?.address && options?.enabled,
  });

  return query;
};

export default useGetNameService;
