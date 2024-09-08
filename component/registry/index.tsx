import { Button, Container, Flex } from "@chakra-ui/react";
import ConnectButton from "../common/connect-button";
import { useCurrentWallet } from "@mysten/dapp-kit";
import NameServiceBlock from "./name-service-block";
import { useState } from "react";
import { getAnimationStyle } from "./animation-style";
import FaceDetectionBlock from "./face-detection-block";
import useCreateAndPostCard from "@/hooks/use-create-and-post-card";
import Mint from "./mint";
import { NameService } from "@/hooks/use-get-name-service";
import Complete from "./complete";

const Registry = () => {
  const [step, setStep] = useState(0);
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

  return (
    <Container
      maxW="container.lg"
      as={Flex}
      flexDirection="column"
      alignItems="center"
      bg="darkTheme.800"
      p="8"
      borderRadius="2xl"
    >
      {step === 0 && (
        <Flex
          flexDirection="column"
          alignItems="center"
          pt="40"
          {...getAnimationStyle(0, step)}
        >
          <Button
            size="md"
            boxShadow="0px 0px 5px #afd6ff"
            onClick={() => {
              setStep(1);
            }}
          >
            Become a Suitizen
          </Button>
        </Flex>
      )}

      <Flex
        borderRadius="2xl"
        h="600px"
        position="relative"
        w="full"
        visibility={step === 0 ? "hidden" : "visible"}
        overflow="hidden"
      >
        <NameServiceBlock
          step={step}
          selectedNameService={selectedNameService}
          onSelected={(nameService) => {
            setSelectedNameService(nameService);
          }}
          onConfirm={() => {
            setStep(2);
          }}
        />
        <FaceDetectionBlock
          step={step}
          onSuccess={(facialContent) => {
            createAndPost({
              name: selectedNameService?.domainName,
              facialContent,
            });
            setStep(3);
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
            setStep(4);
          }}
        />
        <Complete step={step} />
      </Flex>
    </Container>
  );
};

export default Registry;
