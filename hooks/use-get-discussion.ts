import { getInteraction } from "@/sui-api";
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
  host: string;
  objectId: string;
  comments: Comment[];
};

export type GetDiscussionResponse = {
  data: Discussion[];
  page: number;
  hasNextPage: boolean;
};

type GetDiscussionPageResponse = {
  pageParam: number;
  pages: GetDiscussionResponse[];
};

type useGetDiscussionProps = Omit<
  UseInfiniteQueryOptions<
    GetDiscussionResponse,
    Error,
    GetDiscussionPageResponse,
    GetDiscussionResponse,
    string[],
    number
  >,
  "queryKey"
>;

const limit = 6;

const useGetDiscussion = (options?: useGetDiscussionProps) => {
  return useInfiniteQuery({
    queryKey: ["discussion"],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<GetDiscussionResponse> => {
      const data = await getInteraction(1, pageParam, limit);
      return {
        page: pageParam,
        hasNextPage: data.totalCount > pageParam * limit,
        data: data.data,
      } as GetDiscussionResponse;
    },
    initialPageParam: 1,
    getNextPageParam: ({ page }) => page + 1,
    ...options,
  });
};

export default useGetDiscussion;
