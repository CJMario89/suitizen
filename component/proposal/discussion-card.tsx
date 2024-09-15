import useGetCard from "@/hooks/use-get-card";
import { Discussion } from "@/hooks/use-get-discussion";
import usePostComment from "@/hooks/use-post-comment";
import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import UserCommentCell from "../common/user-comment-cell";
import UserCell from "../common/user-cell";

const DiscussionCard = ({
  discussion,
  onOpenDrawer,
}: {
  discussion: Discussion;
  onOpenDrawer: ({ discussion }: { discussion: Discussion }) => void;
}) => {
  const { data: card } = useGetCard();
  //console.log(discussion);
  const hasComments = discussion?.comments?.length > 0;
  //console.log(discussion);
  return (
    <Flex
      flexDirection="column"
      gap="2"
      bg="darkTheme.700"
      borderRadius="2xl"
      py="2"
      cursor="pointer"
      _hover={{
        transform: "scale(1.01)",
        opacity: 0.9,
      }}
      layerStyle="card"
      transition="all 0.3s ease-in-out"
      onClick={() => {
        onOpenDrawer({ discussion });
      }}
    >
      <Flex px="4" flexDirection="column" gap="2">
        <Flex flexDirection="column" gap="2" minH="56">
          <Heading as="h5" noOfLines={2}>
            {discussion.topic}
          </Heading>
          <UserCell objectId={discussion.host} />
          <Text noOfLines={5}>{discussion.description}</Text>
        </Flex>
        <Flex gap="1" flexDirection="column">
          <Divider />
          <Text fontSize="sm">
            {discussion.comments.length} Comment
            {discussion.comments.length > 1 ? "s" : ""}
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="4" gap="2" flexDirection="column" minH="12">
        {hasComments && (
          <UserCommentCell
            objectId={discussion?.comments?.[0]?.sender}
            content={discussion?.comments?.[0]?.content}
            commentProps={{
              noOfLines: 2,
            }}
          />
        )}
        {!hasComments && (
          <Text mt="2" textAlign="center">
            No comment yet
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default DiscussionCard;
