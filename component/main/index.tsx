import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

const Main = () => {
  return (
    <Container
      maxW="container.2xl"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="10"
      bgImage={`url("")`}
    >
      <Box w="full" h="full" position="absolute" top="0" left="0" zIndex="-1">
        <video
          style={{
            maxWidth: "none",
            height: "100%",
          }}
          autoPlay
          playsInline
          muted
          loop
        >
          <source src="/waving.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      <Heading
        mt="40"
        as="h1"
        letterSpacing="0.5px"
        textAlign="center"
        maxW="500px"
        textShadow="2px 2px 8px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)"
      >
        Decentralized Identity Voting on Sui.
      </Heading>
      <Heading
        as="h6"
        textAlign="center"
        maxW="500px"
        textShadow="2px 2px 8px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)"
      >
        Empowering secure, decentralized identity. Experience trustless
        participation in governance and decision-making.
      </Heading>
      <Button
        mt="4"
        as={Link}
        href="/app"
        size="lg"
        boxShadow={"0px 0px 10px rgba(0, 0, 0, 1)"}
      >
        Launch app
      </Button>
    </Container>
  );
};

export default Main;
