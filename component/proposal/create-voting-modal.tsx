import useCreateVoting from "@/hooks/use-create-voting";
import useGetCard from "@/hooks/use-get-card";
import useGetVoting from "@/hooks/use-get-voting";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import IconClose from "../common/icon/close";

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
      refetch();
      onClose();
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const [options, setOptions] = useState<string[]>(["", ""]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text justifyContent="center" w="full">
            Create New Voting
          </Text>
        </ModalHeader>
        <ModalBody>
          <Flex flexDirection="column" gap="2">
            <Textarea placeholder="Topic" ref={topicRef} />
            <Textarea placeholder="Description" ref={descriptionRef} />
            {options.map((option, index) => (
              <Flex key={index} gap="2">
                <Input
                  value={option}
                  placeholder={`Option ${index + 1}`}
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
            <Button
              isLoading={isPending}
              onClick={() => {
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
              }}
            >
              Create
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateVotingModal;
