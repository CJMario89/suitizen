import useGetCard from "@/hooks/use-get-card";
import useGetDiscussion, { Discussion } from "@/hooks/use-get-discussion";
import usePostComment from "@/hooks/use-post-comment";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRef } from "react";
import UserCell from "../common/user-cell";
import UserCommentCell from "../common/user-comment-cell";

const DiscussionDrawer = ({
  isOpen,
  onClose,
  discussion,
}: {
  isOpen: boolean;
  onClose: () => void;
  discussion?: Discussion;
}) => {
  const { refetch, data } = useGetDiscussion();
  let currentDiscussion = discussion;
  data?.pages.forEach((page) => {
    page.data.forEach((item) => {
      if (item.objectId === discussion?.objectId) {
        currentDiscussion = item;
      }
    });
  });
  const { data: card } = useGetCard();
  const { mutate: comment, isPending: isCommenting } = usePostComment({
    onSuccess: () => {
      inputRef.current!.value = "";
      refetch();
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const onSubmit = () => {
    if (inputRef.current?.value && card && currentDiscussion) {
      comment({
        content: inputRef.current.value,
        cardId: card[0].objectId,
        proposalId: currentDiscussion.objectId,
      });
    }
  };
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader px="4" pb="0">
          <Heading as="h4">{currentDiscussion?.topic}</Heading>
        </DrawerHeader>
        <DrawerBody px="0" pt="0">
          <Flex flexDirection="column" gap="2" py="2">
            <Flex px="4" flexDirection="column" gap="2">
              <UserCell objectId={currentDiscussion?.proposer} />
              <Flex flexDirection="column" gap="2" minH="40">
                <Text>{currentDiscussion?.description}</Text>
              </Flex>
              <Flex gap="2" flexDirection="column">
                <Divider />
                <Text>Comment</Text>
              </Flex>
            </Flex>
            <Divider />
            <Flex px="4" gap="2" flexDirection="column">
              {currentDiscussion?.comments.map((comment, i) => {
                return (
                  <UserCommentCell
                    key={i}
                    objectId={comment.sender}
                    content={comment.content}
                  />
                );
              })}
            </Flex>
          </Flex>
        </DrawerBody>
        <DrawerFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            style={{
              width: "100%",
            }}
          >
            <Flex flexDirection="column" gap="4" flex="1">
              <Textarea w="full" ref={inputRef} placeholder="Comment" />
              <Button
                alignSelf="flex-end"
                size="sm"
                type="submit"
                isLoading={isCommenting}
              >
                Submit
              </Button>
            </Flex>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DiscussionDrawer;
