import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Card } from "./use-get-card";
import { getCardDetail } from "@/sui-api";

type UseGetCardDetailProps = Omit<
  UseQueryOptions<Card> & {
    objectId?: string;
  },
  "queryKey"
>;

const useGetCardDetail = ({ objectId, ...options }: UseGetCardDetailProps) => {
  return useQuery({
    queryKey: ["card", objectId],
    queryFn: async () => {
      if (!objectId) throw new Error("No object id");
      return getCardDetail(objectId);
    },
    ...options,
    enabled: !!objectId && options?.enabled,
  });
};

export default useGetCardDetail;
