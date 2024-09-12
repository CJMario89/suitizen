import useGetCard from "@/hooks/use-get-card";
import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";

const Profile = () => {
  const { data } = useGetCard();
  const card = data?.[0];
  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="4"
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
    </Container>
  );
};

export default Profile;
