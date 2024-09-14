import useGetCard from "@/hooks/use-get-card";
import useTransferBackup from "@/hooks/use-transfer-backup";
import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

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
        <Text>{address}</Text>
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

const Profile = ({
  setPath,
}: {
  setPath: Dispatch<SetStateAction<string>>;
}) => {
  const { data } = useGetCard();
  const card = data?.[0];

  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="8"
    >
      <Heading as="h2">
        Welcome {card?.firstName} {card?.lastName}
      </Heading>
      <Image
        src={card?.cardImg ?? ""}
        alt={card?.lastName ?? ""}
        width={512}
        height={512}
      />
      <Button
        onClick={() => {
          setPath("/community");
        }}
      >
        Go to Community
      </Button>
      <Flex flexDirection="column" gap="4">
        <Heading as="h4">Transfer to backup wallet</Heading>
        {card?.backup?.map((backup, index) => {
          return <TransferOption key={index} address={backup} index={index} />;
        })}
      </Flex>
    </Container>
  );
};

export default Profile;
