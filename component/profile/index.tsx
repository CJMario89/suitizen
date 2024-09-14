import useGetCard from "@/hooks/use-get-card";
import useTransferBackup from "@/hooks/use-transfer-backup";
import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";

const Profile = () => {
  const { data, refetch } = useGetCard();
  const card = data?.[0];
  const { mutate: transfer, isPending } = useTransferBackup({
    onSuccess: () => {
      refetch();
      window.location.reload();
    },
  });
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
        width={400}
        height={600}
      />
      <Button as="a" href="/community">
        Go to Community
      </Button>
      <Flex flexDirection="column" gap="4">
        <Heading as="h4">Transfer to backup wallet</Heading>
        {card?.backup?.map((backup, index) => {
          return (
            <Flex key={index} gap="2" flexDirection="column">
              <Flex gap="4" alignItems="center">
                <Text>{backup}</Text>
                <Button
                  variant="solid"
                  size="sm"
                  isDisabled={isPending}
                  isLoading={isPending}
                  onClick={() => {
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
        })}
      </Flex>
    </Container>
  );
};

export default Profile;
