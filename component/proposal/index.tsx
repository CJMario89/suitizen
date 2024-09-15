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
    <Container maxW="container.lg" px="8" h="100vh" justifyContent="center">
      <Tabs mt="120px">
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
  );
};

export default Proposal;
