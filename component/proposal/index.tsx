import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import DiscussionBoard from "./discussion-board";
import VoteBoard from "./voting-board";
import { Dispatch, SetStateAction } from "react";

const Proposal = ({
  setPath,
}: {
  setPath: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Flex flexDirection="column" gap="10" w="full">
      {/* <Box bg="darkTheme.700" w="full" h="200px" /> */}
      <Container maxW="container.lg" px="8">
        <Tabs>
          <TabList>
            <Tab>Discussion</Tab>
            <Tab>Vote</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DiscussionBoard />
            </TabPanel>
            <TabPanel>
              <VoteBoard />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Flex>
  );
};

export default Proposal;
