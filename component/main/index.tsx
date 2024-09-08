import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

const Main = () => {
  return (
    <Container
      maxW="container.2xl"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="10"
    >
      <Heading
        mt="40"
        as="h1"
        letterSpacing="-1px"
        textAlign="center"
        maxW="500px"
      >
        Decentralized Identity Voting on Sui.
      </Heading>
      <Heading as="h6" textAlign="center" maxW="500px">
        Empowering secure, decentralized identity. Experience trustless
        participation in governance and decision-making.
      </Heading>
      <Button
        mt="4"
        as={Link}
        href="/app"
        size="lg"
        boxShadow="0px 0px 5px #afd6ff"
      >
        Launch app
      </Button>
    </Container>
  );
};

export default Main;
