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
  useMediaQuery,
} from "@chakra-ui/react";
import NameServiceBlock from "./name-service-block";
import { useState } from "react";
import { getAnimationStyle } from "./animation-style";
import FaceDetectionBlock from "./face-detection-block";
import useCreateAndPostCard from "@/hooks/use-create-and-post-card";
import Mint from "./mint";
import { NameService } from "@/hooks/use-get-name-service";
import Complete from "./complete";
import { useCurrentWallet } from "@mysten/dapp-kit";
import Backup from "./backup";

const steps = [
  {
    title: "Select a name service",
    description: "Choose a name service to register your name.",
  },
  {
    title: "Face detection",
    description: "Detect your face to prepare for card creation.",
  },
  {
    title: "Set backup address",
    description: "Set backup address for your card.",
  },
  {
    title: "Create Suitizen card",
    description: "Generate your Suitizen card.",
  },
  {
    title: "Complete",
    description: "You are now a Suitizen.",
  },
];

const StepperBlock = ({
  step,
  isInStep,
}: {
  step: number;
  isInStep?: boolean;
}) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  return (
    <Stepper
      index={step}
      orientation="vertical"
      py="8"
      display={isDesktop || !isInStep ? "flex" : "none"}
    >
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
  const [backups, setBackups] = useState<string[]>([""]);

  const {
    mutate: createAndPost,
    data: card,
    isPending: isCreating,
  } = useCreateAndPostCard({
    onError: (e) => {
      window.location.reload();
      alert("Create Suitizen Card Error");
      console.log(e);
    },
  });
  const { connectionStatus } = useCurrentWallet();
  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      // bg="darkTheme.800"
      p="8"
      pt={step === -1 ? "8" : { base: "24", md: "8" }}
      h="100vh"
      justifyContent="center"
    >
      {step === -1 && (
        <Flex
          flexDirection="column"
          alignItems="center"
          pt="20"
          gap={{
            base: "4",
            md: "8",
          }}
          {...getAnimationStyle(-1, step)}
        >
          <Heading
            as="h3"
            fontSize={{
              base: "2xl",
              md: "4xl",
            }}
            w={{
              base: "full",
              md: "500px",
            }}
            textAlign="center"
          >
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
        h={step === -1 ? "0px" : "600px"}
        position="relative"
        w="full"
        visibility={step === -1 ? "hidden" : "visible"}
        gap="8"
      >
        {step !== -1 && <StepperBlock step={step} isInStep />}
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
              onSuccess={(facialContent, gender) => {
                createAndPost({
                  name: selectedNameService?.domainName,
                  facialContent,
                  gender,
                });
                setStep(2);
              }}
            />
            <Backup
              setBackups={setBackups}
              step={step}
              backups={backups}
              isPreparing={isCreating}
              onSuccess={() => {
                setBackups(backups);
                setStep(3);
              }}
            />
            <Mint
              backups={backups}
              step={step}
              faceId={card?.walrusFacialId}
              pfpId={card?.pfpId}
              cardId={card?.walrusCardId}
              nameId={selectedNameService?.objectId}
              index={Math.floor(Math.random() * 10000)}
              onSuccess={() => {
                setStep(4);
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
