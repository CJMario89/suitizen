import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { createContext } from "react";

export const ModalContext = createContext<UseDisclosureProps>({});

const ErrorModal = ({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h4">Error</Heading>
        </ModalHeader>
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ErrorModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const errorDisclosure = useDisclosure();
  return (
    <ModalContext.Provider value={errorDisclosure}>
      {children}
      <ErrorModal
        isOpen={errorDisclosure.isOpen}
        onClose={errorDisclosure.onClose}
        message="Gas fee is not enough for this transaction"
      />
    </ModalContext.Provider>
  );
};
