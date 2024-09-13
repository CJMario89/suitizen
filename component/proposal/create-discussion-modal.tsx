import useCreateDiscussion from "@/hooks/use-create-discussion";
import useGetCard from "@/hooks/use-get-card";
import useGetDiscussion from "@/hooks/use-get-discussion";
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FormEvent, useRef, useState } from "react";
import ErrorText from "../common/error-text";
import { refreshInteractionData } from "@/sui-api";

const topicErrorText = "Topic is required";
const descriptionErrorText = "Description is required";

const CreateDiscussionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: cards } = useGetCard();
  const topicRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { refetch } = useGetDiscussion();
  const { mutate: createDiscussion, isPending } = useCreateDiscussion({
    onSuccess: async () => {
      console.log("onSuccess");
      await refreshInteractionData();
      refetch();
      onClose();
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = [];
    if (!topicRef.current?.value) {
      errors.push(topicErrorText);
    }
    if (!descriptionRef.current?.value) {
      errors.push(descriptionErrorText);
    }
    setErrors(errors);
    if (
      !cards?.[0].objectId ||
      !topicRef.current?.value ||
      !descriptionRef.current?.value
    )
      return;

    createDiscussion({
      title: topicRef.current?.value,
      description: descriptionRef.current?.value,
      cardId: cards?.[0].objectId,
    });
  };
  const topicError = errors.includes(topicErrorText);
  const descriptionError = errors.includes(descriptionErrorText);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setErrors([]);
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalCloseButton />
      <form onSubmit={onSubmit}>
        <ModalContent>
          <ModalHeader>
            <Heading justifyContent="center" w="full">
              Create New Discussion
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Flex flexDirection="column" gap="4">
              <Flex flexDirection="column" gap="2">
                <Text>
                  Topic{" "}
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Textarea
                  isInvalid={topicError}
                  placeholder="Type your topic here"
                  ref={topicRef}
                />
                <ErrorText isError={topicError} errorText={topicErrorText} />
              </Flex>
              <Flex flexDirection="column" gap="2">
                <Text>
                  Description{" "}
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Textarea
                  isInvalid={descriptionError}
                  placeholder="Type your description here"
                  ref={descriptionRef}
                />
                <ErrorText
                  isError={descriptionError}
                  errorText={descriptionErrorText}
                />
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="flex-end" gap="2">
              <Button isLoading={isPending} type="submit">
                Create
              </Button>
              <Button
                onClick={() => {
                  setErrors([]);
                  onClose();
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateDiscussionModal;
