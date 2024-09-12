import useGetDiscussion, { Discussion } from "@/hooks/use-get-discussion";
import { Button, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import DiscussionCard from "./discussion-card";
import DiscussionModal from "./discussion-modal";
import { useState } from "react";
import CreateDiscussionModal from "./create-discussion-modal";

const DiscussionBoard = () => {
  const { data, isFetchingNextPage, fetchNextPage } = useGetDiscussion();
  const items = data?.pages;
  const discussions = items?.flatMap((item) => item.data);
  discussions?.sort((a, b) => {
    return Number(b.flowNum) - Number(a.flowNum);
  });
  const hasNextPage = data?.pages?.[data.pages.length - 1]?.hasNextPage;
  const drawerDisclosure = useDisclosure();
  const createDiscussionModalDisclosure = useDisclosure();
  const [drawerDiscussion, setDrawerDiscussion] = useState<Discussion>();
  return (
    <Flex flexDirection="column" gap="4" w="full">
      <Flex w="full" justifyContent="flex-end">
        <Button
          onClick={() => {
            createDiscussionModalDisclosure.onOpen();
          }}
        >
          Create New Discussion
        </Button>
      </Flex>
      <SimpleGrid columns={3} spacing={{ base: "4", lg: "6" }}>
        {discussions?.map((discussion) => {
          return (
            <DiscussionCard
              key={discussion.objectId}
              discussion={discussion}
              onOpenDrawer={({ discussion }) => {
                setDrawerDiscussion(discussion);
                drawerDisclosure.onOpen();
              }}
            />
          );
        })}
      </SimpleGrid>
      {hasNextPage && (
        <Button
          isLoading={isFetchingNextPage}
          variant="ghost"
          alignSelf="center"
          onClick={() => {
            fetchNextPage();
          }}
        >
          View More
        </Button>
      )}
      <DiscussionModal {...drawerDisclosure} discussion={drawerDiscussion} />
      <CreateDiscussionModal {...createDiscussionModalDisclosure} />
    </Flex>
  );
};

export default DiscussionBoard;
