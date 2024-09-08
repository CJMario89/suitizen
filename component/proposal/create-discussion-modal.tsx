import useCreateDiscussion from "@/hooks/use-create-discussion";
import useGetCard from "@/hooks/use-get-card";
import useGetDiscussion from "@/hooks/use-get-discussion";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FormEvent, useRef, useState } from "react";
import ErrorText from "../common/error-text";

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
      <form onSubmit={onSubmit}>
        <ModalContent>
          <ModalHeader>
            <Textarea
              isInvalid={topicError}
              placeholder="Topic"
              ref={topicRef}
            />
            <ErrorText isError={topicError} errorText={topicErrorText} />
          </ModalHeader>
          <ModalBody>
            <Textarea
              isInvalid={descriptionError}
              placeholder="Description"
              ref={descriptionRef}
            />
            <ErrorText
              isError={descriptionError}
              errorText={descriptionErrorText}
            />
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
