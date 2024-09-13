import {
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import UserCell from "../common/user-cell";
import useGetVoting, { Option, Voting } from "@/hooks/use-get-voting";
import useVote from "@/hooks/use-vote";
import useGetCard from "@/hooks/use-get-card";
import { useEffect, useState } from "react";
import { refreshInteractionData } from "@/sui-api";

const VotingOption = ({
  proposalId,
  option,
}: {
  proposalId: string;
  option: Option;
}) => {
  const { data: card } = useGetCard();
  const { refetch, isRefetching } = useGetVoting();
  const [isTargetRefetching, setIsTargetRefetching] = useState(false);
  const { mutate: vote, isPending } = useVote({
    onSuccess: async () => {
      await refreshInteractionData();
      refetch();
    },
    onError: (e) => {
      console.log(e);
      setIsTargetRefetching(false);
    },
  });
  useEffect(() => {
    if (!isRefetching) {
      setIsTargetRefetching(false);
    }
  }, [isRefetching]);
  return (
    <Button
      variant="outline"
      onClick={() => {
        if (!card || !option || !proposalId)
          throw new Error("missing card or option or proposalId");
        vote({
          cardId: card[0].objectId,
          proposalId,
          voteOption: option.index,
        });
        setIsTargetRefetching(true);
      }}
      borderRadius="lg"
      px="4"
    >
      <Flex
        justifyContent="space-between"
        w="full"
        position="relative"
        alignItems="center"
      >
        <Text maxW="80%" overflowX="auto">
          {option.content}
        </Text>
        {(isPending || (isTargetRefetching && isRefetching)) && (
          <Skeleton h="4" w="4" />
        )}
        {!isPending && !isTargetRefetching && <Text>{option.amount}</Text>}
      </Flex>
    </Button>
  );
};

const VotingCard = ({ voting }: { voting: Voting }) => {
  const hasOptions = voting.options.length > 0;
  console.log(voting);
  return (
    <Flex
      flexDirection="column"
      gap="2"
      layerStyle="card"
      borderRadius="2xl"
      py="2"
    >
      <Flex px="4" flexDirection="column" gap="2">
        <Flex flexDirection="column" gap="2" minH="56">
          <Heading as="h5" h="8" overflowY="auto">
            {voting.topic}
          </Heading>
          <UserCell href="" objectId={voting.host} />
          <Text h="40" overflowY="auto">
            {voting.description}
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="4" gap="2" flexDirection="column" minH="12">
        {hasOptions &&
          voting.options.map((option) => {
            return (
              <VotingOption
                key={option.index}
                option={option}
                proposalId={voting.objectId}
              />
            );
          })}
      </Flex>
    </Flex>
  );
};

export default VotingCard;
