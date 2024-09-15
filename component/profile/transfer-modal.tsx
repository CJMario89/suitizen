import useGetCard from "@/hooks/use-get-card";
import useTransferBackup from "@/hooks/use-transfer-backup";
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { formatAddress } from "../common/connect-button";

const TransferOption = ({
  address,
  index,
}: {
  address: string;
  index: number;
}) => {
  const { data, refetch } = useGetCard();
  const { mutate: transfer, isPending } = useTransferBackup({
    onSuccess: () => {
      refetch();
      window.location.reload();
    },
    onError: (e) => {
      console.log(e);
      console.log("error");
    },
  });
  const card = data?.[0];

  return (
    <Flex gap="2" flexDirection="column">
      <Flex gap="4" alignItems="center">
        <Text>{formatAddress(address)}</Text>
        <Button
          variant="solid"
          size="sm"
          isDisabled={isPending}
          isLoading={isPending}
          onClick={() => {
            if (!card) return;
            transfer({
              cardId: card.objectId,
              index: index,
            });
          }}
        >
          Transfer
        </Button>
      </Flex>
    </Flex>
  );
};
const TransferModal = ({
  isOpen,
  onClose,
  backups,
}: {
  isOpen: boolean;
  onClose: () => void;
  backups: string[];
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent p="6">
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h4">Transfer to backup wallet</Heading>
        </ModalHeader>
        <ModalBody>
          <Flex gap="4" flexDirection="column">
            {backups.map((backup, index) => {
              return (
                <TransferOption key={index} address={backup} index={index} />
              );
            })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
