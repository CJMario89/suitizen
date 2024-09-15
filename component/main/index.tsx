import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const Main = ({ setPath }: { setPath: Dispatch<SetStateAction<string>> }) => {
  return (
    <Container
      maxW="container.2xl"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      gap="10"
      h="100vh"
      justifyContent="center"
    >
      <Box w="full" h="full" position="absolute" top="0" left="0" zIndex="-1">
        <video
          style={{
            minWidth: "100%",
            minHeight: "100%",
            objectFit: "cover",
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
      <Flex flexDirection="column" alignItems="center">
        <Heading
          as="h1"
          fontSize={{ base: "4xl", md: "5xl" }}
          letterSpacing="0.5px"
          textAlign="center"
          maxW="600px"
          textShadow="2px 2px 8px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)"
        >
          Real Identity, Real Human
        </Heading>
        <Heading as="h1" fontSize={{ base: "4xl", md: "5xl" }}>
          - For Sui Citizens.
        </Heading>
      </Flex>

      <Heading
        as="h6"
        textAlign="center"
        maxW="500px"
        textShadow="2px 2px 8px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)"
      >
        Empowering secure, decentralized identity. Experience trustless
        participation in community.
      </Heading>
      <Button
        mt="4"
        onClick={() => setPath("/app")}
        size={{ base: "md", md: "lg" }}
        boxShadow={"0px 0px 10px rgba(0, 0, 0, 1)"}
      >
        Launch app
      </Button>
    </Container>
  );
};

export default Main;
