import { getProposal } from "@/sui-api";
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
  proposer: string;
  objectId: string;
  options: Option[];
};

export type GetVotingResponse = {
  hasNextPage: boolean;
  nextCursor: string | null;
  data: Voting[];
};

type GetVotingPageResponse = {
  pageParam: string | null;
  pages: GetVotingResponse[];
};

type useGetVotingProps = Omit<
  UseInfiniteQueryOptions<
    GetVotingResponse,
    Error,
    GetVotingPageResponse,
    GetVotingResponse,
    string[],
    string | null
  >,
  "queryKey"
>;

const useGetVoting = (options?: useGetVotingProps) => {
  return useInfiniteQuery({
    queryKey: ["voting"],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: string | null;
    }): Promise<GetVotingResponse> => {
      return (await getProposal(0, pageParam ?? null, 6)) as GetVotingResponse;
    },
    initialPageParam: null,
    getNextPageParam: (data) => data.nextCursor,
    ...options,
  });
};

export default useGetVoting;
