import useGetCard from "@/hooks/use-get-card";
import {
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import TransferModal from "./transfer-modal";

const Profile = ({
  setPath,
}: {
  setPath: Dispatch<SetStateAction<string>>;
}) => {
  const { data } = useGetCard();
  const card = data?.[0];
  const transferDisclosure = useDisclosure();

  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="4"
      justifyContent="center"
      h="100vh"
    >
      <Heading
        as="h2"
        fontSize={{
          base: "2xl",
          md: "4xl",
        }}
        mt={{
          base: "8",
          md: "0",
        }}
      >
        Welcome {card?.firstName} {card?.lastName}
      </Heading>
      <Image
        src={card?.cardImg ?? ""}
        alt={card?.lastName ?? ""}
        width={400}
        height={400}
      />
      <Button
        onClick={() => {
          setPath("/community");
        }}
      >
        Go to Community
      </Button>
      {card?.backup && card.backup?.length > 0 && (
        <Button
          onClick={() => {
            transferDisclosure.onOpen();
          }}
        >
          Transfer
        </Button>
      )}
      <TransferModal backups={card?.backup ?? []} {...transferDisclosure} />
    </Container>
  );
};

export default Profile;
