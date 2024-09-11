import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Tooltip,
  useSteps,
} from "@chakra-ui/react";
import NameServiceBlock from "./name-service-block";
import { useState } from "react";
import { getAnimationStyle } from "./animation-style";
import FaceDetectionBlock from "./face-detection-block";
import useCreateAndPostCard from "@/hooks/use-create-and-post-card";
import Mint from "./mint";
import { NameService } from "@/hooks/use-get-name-service";
import Complete from "./complete";
import {
  useAutoConnectWallet,
  useConnectWallet,
  useCurrentWallet,
} from "@mysten/dapp-kit";

const steps = [
  {
    title: "Select a name service",
    description: "Choose a name service to register your name.",
  },
  {
    title: "Face detection",
    description: "Detect your face to mint your card.",
  },
  {
    title: "Minting",
    description: "Mint your card.",
  },
  {
    title: "Complete",
    description: "You are now a Suitizen.",
  },
];

const StepperBlock = ({ step }: { step: number }) => {
  return (
    <Stepper index={step} orientation="vertical" py="8">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

const Registry = () => {
  const [step, setStep] = useState(-1);
  const [selectedNameService, setSelectedNameService] = useState<NameService>();
  const {
    mutate: createAndPost,
    data: card,
    isPending: isCreating,
  } = useCreateAndPostCard({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (e) => {
      console.log(e);
    },
  });
  console.log(step);
  const { connectionStatus } = useCurrentWallet();
  const autoConnectStatus = useAutoConnectWallet();
  const { mutate: connect } = useConnectWallet();
  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      // bg="darkTheme.800"
      p="8"
    >
      {step === -1 && (
        <Flex
          flexDirection="column"
          alignItems="center"
          pt="20"
          gap="8"
          {...getAnimationStyle(-1, step)}
        >
          <Heading as="h3" w="500px" textAlign="center">
            You are steps away from becoming a Suitizen on Sui.
          </Heading>
          <Tooltip
            isDisabled={connectionStatus === "connected"}
            label="Please connect wallet"
          >
            <Button
              size="md"
              boxShadow="0px 0px 5px #afd6ff"
              onClick={() => {
                setStep(0);
              }}
              isDisabled={connectionStatus === "disconnected"}
            >
              Become a Suitizen
            </Button>
          </Tooltip>

          <Flex
            borderRadius="2xl"
            border="1px solid"
            borderColor="neutral.50"
            px="4"
          >
            <StepperBlock step={step} />
          </Flex>
        </Flex>
      )}

      <Flex
        h={step === -1 ? "400px" : "600px"}
        position="relative"
        w="full"
        visibility={step === -1 ? "hidden" : "visible"}
        gap="8"
      >
        {step !== -1 && <StepperBlock step={step} />}
        <Flex position="relative" w="full" flexDirection="column" gap="4">
          <Heading as="h3">{steps[step]?.title}</Heading>
          <Flex
            position="relative"
            flex="1"
            borderRadius="2xl"
            overflow="hidden"
          >
            <NameServiceBlock
              step={step}
              selectedNameService={selectedNameService}
              onSelected={(nameService) => {
                setSelectedNameService(nameService);
              }}
              onConfirm={() => {
                setStep(1);
              }}
            />
            <FaceDetectionBlock
              step={step}
              onSuccess={(facialContent) => {
                createAndPost({
                  name: selectedNameService?.domainName,
                  facialContent,
                });
                setStep(2);
              }}
            />
            <Mint
              step={step}
              faceId={card?.walrusFacialId}
              pfpId={card?.pfpId}
              cardId={card?.walrusCardId}
              nameId={selectedNameService?.objectId}
              index={Math.floor(Math.random() * 10000)}
              isPreparing={isCreating}
              onSuccess={() => {
                setStep(3);
              }}
            />
            <Complete step={step} />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Registry;
