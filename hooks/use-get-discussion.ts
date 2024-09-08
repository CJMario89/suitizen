import { getProposal } from "@/sui-api";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export type Comment = {
  name: string;
  content: string;
  sender: string;
};

export type Discussion = {
  category: string;
  categoryStr: "DISCUSS";
  topic: string;
  description: string;
  flowNum: string;
  proposer: string;
  objectId: string;
  comments: Comment[];
};

export type GetDiscussionResponse = {
  hasNextPage: boolean;
  nextCursor: string | null;
  data: Discussion[];
};

type GetDiscussionPageResponse = {
  pageParam: string | null;
  pages: GetDiscussionResponse[];
};

type useGetDiscussionProps = Omit<
  UseInfiniteQueryOptions<
    GetDiscussionResponse,
    Error,
    GetDiscussionPageResponse,
    GetDiscussionResponse,
    string[],
    string | null
  >,
  "queryKey"
>;

const useGetDiscussion = (options?: useGetDiscussionProps) => {
  return useInfiniteQuery({
    queryKey: ["discussion"],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: string | null;
    }): Promise<GetDiscussionResponse> => {
      return (await getProposal(
        1,
        pageParam ?? null,
        6
      )) as GetDiscussionResponse;
    },
    initialPageParam: null,
    getNextPageParam: (data) => data.nextCursor,
    ...options,
  });
};

export default useGetDiscussion;
