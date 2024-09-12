import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

const Guardian = () => {
  const [error, setError] = useState("");
  return (
    <Flex bg="darkTheme.800" flexDirection="column">
      <Heading as="h2" color="darkTheme.50">
        Guardian
      </Heading>
      <Flex flexDirection="column" gap="2">
        <Input placeholder="Type guardian name service" />
        <Text display={error === "" ? "none" : "block"}>{error}</Text>
        <Button>Add guardian</Button>
      </Flex>
    </Flex>
  );
};

export default Guardian;
