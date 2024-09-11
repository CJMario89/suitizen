import useGetVoting, { Voting } from "@/hooks/use-get-voting";
import { Button, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import VotingCard from "./voting-card";
import CreateVotingModal from "./create-voting-modal";

const VotingBoard = () => {
  const { data, isFetchingNextPage, fetchNextPage } = useGetVoting();
  const items = data?.pages;
  const votings = items?.flatMap((item) => item.data);
  votings?.sort((a, b) => {
    return Number(b.flowNum) - Number(a.flowNum);
  });
  const hasNextPage = data?.pages?.[data.pages.length - 1]?.hasNextPage;
  const createVotingModalDisclosure = useDisclosure();
  return (
    <Flex flexDirection="column" gap="4" w="full">
      <Flex w="full" justifyContent="flex-end">
        <Button
          onClick={() => {
            createVotingModalDisclosure.onOpen();
          }}
        >
          Create New Voting
        </Button>
      </Flex>
      <SimpleGrid columns={3} spacing={{ base: "4", lg: "5" }}>
        {votings?.map((voting) => {
          return <VotingCard key={voting.objectId} voting={voting} />;
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
      <CreateVotingModal {...createVotingModalDisclosure} />
    </Flex>
  );
};

export default VotingBoard;
