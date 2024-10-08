import useGetVoting, { Voting } from "@/hooks/use-get-voting";
import {
  Button,
  Flex,
  SimpleGrid,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import VotingCard from "./voting-card";
import CreateVotingModal from "./create-voting-modal";

const VotingBoard = () => {
  const { data, isFetchingNextPage, fetchNextPage, isPending } = useGetVoting();
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
      <SimpleGrid
        columns={{
          base: 1,
          md: 3,
        }}
        spacing={{ base: "4", lg: "5" }}
      >
        {/* Skeloton */}
        {isPending &&
          Array.from({ length: 6 }).map((_, index) => {
            return (
              <Skeleton
                isLoaded={!isPending}
                key={index}
                h="340px"
                borderRadius="2xl"
              />
            );
          })}
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
