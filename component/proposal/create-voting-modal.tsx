import useCreateVoting from "@/hooks/use-create-voting";
import useGetCard from "@/hooks/use-get-card";
import useGetVoting from "@/hooks/use-get-voting";
import {
  Button,
  Flex,
  Heading,
  Input,
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
import { useRef, useState } from "react";
import IconClose from "../common/icon/close";
import ErrorText from "../common/error-text";
import { refreshInteractionData } from "@/sui-api";

// await 1s
export const await1s = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 1000);
  });
};

const CreateVotingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: cards } = useGetCard();
  const topicRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { refetch } = useGetVoting();
  const { mutate: createVoting, isPending } = useCreateVoting({
    onSuccess: async () => {
      await await1s();

      await refreshInteractionData();

      refetch();
      onClose();
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(["", ""]);

  const topicErrorText = "Topic is required";
  const descriptionErrorText = "Description is required";
  const optionErrorText = "Option is required";

  const topicError = errors.includes("Topic is required");
  const descriptionError = errors.includes("Description is required");
  const optionError = errors.includes("Option is required");

  const onSubmit = () => {
    if (!topicRef.current?.value) {
      errors.push(topicErrorText);
    }
    if (!descriptionRef.current?.value) {
      errors.push(descriptionErrorText);
    }
    if (options.some((option) => !option)) {
      errors.push(optionErrorText);
    }
    setErrors(errors);

    if (
      !cards?.[0].objectId ||
      !topicRef.current?.value ||
      !descriptionRef.current?.value ||
      options.length < 2
    )
      return;

    createVoting({
      title: topicRef.current?.value,
      description: descriptionRef.current?.value,
      cardId: cards?.[0].objectId,
      options,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setErrors([]);
        onClose();
      }}
    >
      <ModalOverlay />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ModalContent>
          <ModalCloseButton />

          <ModalHeader>
            <Heading justifyContent="center" w="full">
              Create New Voting
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Flex flexDirection="column" gap="4">
              <Flex flexDirection="column" gap="2">
                <Text>
                  Topic
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Textarea placeholder="type your topic here" ref={topicRef} />
                <ErrorText isError={topicError} errorText={topicErrorText} />
              </Flex>
              <Flex flexDirection="column" gap="2">
                <Text>
                  Description
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Textarea
                  placeholder="type your description here"
                  ref={descriptionRef}
                />
                <ErrorText
                  isError={descriptionError}
                  errorText={descriptionErrorText}
                />
              </Flex>
              {options.map((option, index) => (
                <Flex key={index} gap="2" flexDirection="column">
                  <Text>
                    Option {index + 1}
                    <Text as="span" color="error.500">
                      *
                    </Text>
                  </Text>
                  <Flex gap="2" alignItems="center">
                    <Input
                      value={option}
                      placeholder={`type your option here`}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      borderRadius="lg"
                      size="md"
                    />
                    <Button
                      isDisabled={options.length < 3}
                      onClick={() => {
                        setOptions(options.filter((_, i) => i !== index));
                      }}
                      variant="none"
                      size="sm"
                      px="0"
                    >
                      <IconClose />
                    </Button>
                  </Flex>
                  <ErrorText
                    isError={optionError}
                    errorText={optionErrorText}
                  />
                </Flex>
              ))}
              <Button
                onClick={() => {
                  setOptions([...options, ""]);
                }}
                variant="outline"
                size="sm"
                alignSelf="self-start"
              >
                Add Option
              </Button>
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
                isDisabled={isPending}
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

export default CreateVotingModal;
