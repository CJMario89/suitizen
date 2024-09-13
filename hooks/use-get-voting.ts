import { getInteraction } from "@/sui-api";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export type Option = {
  index: number;
  amount: string;
  content: string;
};

export type Voting = {
  category: string;
  categoryStr: "VOTE";
  topic: string;
  description: string;
  flowNum: string;
  host: string;
  objectId: string;
  options: Option[];
};

export type GetVotingResponse = {
  page: number;
  data: Voting[];
  hasNextPage: boolean;
};

type GetVotingPageResponse = {
  pageParam: number;
  pages: GetVotingResponse[];
};

type useGetVotingProps = Omit<
  UseInfiniteQueryOptions<
    GetVotingResponse,
    Error,
    GetVotingPageResponse,
    GetVotingResponse,
    string[],
    number
  >,
  "queryKey"
>;

const limit = 6;

const useGetVoting = (options?: useGetVotingProps) => {
  return useInfiniteQuery({
    queryKey: ["voting"],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<GetVotingResponse> => {
      const data = await getInteraction(0, pageParam, limit);
      return {
        page: pageParam,
        hasNextPage: data.totalCount > pageParam * limit,
        data: data.data,
      } as GetVotingResponse;
    },
    initialPageParam: 1,
    getNextPageParam: ({ page }) => page + 1,
    ...options,
  });
};

export default useGetVoting;
