import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { getAnimationStyle } from "./animation-style";
import useMint from "@/hooks/use-mint";
import Image from "next/image";
import Loading from "/assets/loading.gif";
import IconClose from "../common/icon/close";
import ErrorText from "../common/error-text";

const Mint = ({
  step,
  faceId,
  pfpId,
  cardId,
  nameId,
  index,
  isPreparing,
  onSuccess,
}: {
  step: number;
  faceId?: string;
  pfpId?: string;
  cardId?: string;
  nameId?: string;
  index: number;
  isPreparing: boolean;
  onSuccess: () => void;
}) => {
  const [backups, setBackups] = useState<string[]>([]);

  const {
    mutate: mint,
    isPending,
    data,
  } = useMint({
    faceId,
    pfpId,
    cardId,
    nameId,
    index,
    backup: backups,
    onSuccess: () => {
      console.log("minted");
      onSuccess();
    },
  });
  const isError = backups.some(
    (b) => b !== "" && (!b.startsWith("0x") || b.length !== 66)
  );
  const backupErrorText = "Invalid backup address";
  return (
    <Flex
      position="absolute"
      w="full"
      flexDirection="column"
      gap="8"
      h="full"
      bg="darkTheme.700"
      alignItems="center"
      p="4"
      {...getAnimationStyle(2, step)}
    >
      {isPreparing ? (
        <Flex
          w="full"
          h="full"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="4"
        >
          <Heading as="h4">Preparing your Suitizen</Heading>
          <Image src={Loading} alt="loading" width="80" height="80" />
        </Flex>
      ) : (
        <Flex
          w="full"
          h="full"
          alignItems="center"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex gap="4" flexDirection="column">
            <Heading as="h4" alignSelf="self-start">
              Backup your Suitizen Card (optional)
            </Heading>
            <Text alignSelf="self-start">
              Your Suitizen Card is a unique digital identity. To ensure you
              wont potentially lose access to your Suitizen Card, please backup
              the Address to your transfer wallet. (up to 5 backups)
            </Text>
            <Flex gap="2" flexDirection="column" maxH="300" overflow="auto">
              {backups.map((backup, index) => (
                <Flex key={index} gap="2" flexDirection="column">
                  <Text>backup address</Text>
                  <Flex gap="2" alignItems="center">
                    <Input
                      value={backup}
                      placeholder={`type your backup here`}
                      onChange={(e) => {
                        const newbackups = [...backups];
                        newbackups[index] = e.target.value;
                        setBackups(newbackups);
                      }}
                      borderRadius="lg"
                      size="md"
                    />
                    <Button
                      onClick={() => {
                        setBackups(backups.filter((_, i) => i !== index));
                      }}
                      variant="none"
                      size="sm"
                      px="0"
                    >
                      <IconClose />
                    </Button>
                  </Flex>
                  <ErrorText
                    isError={
                      backup !== "" &&
                      (!backup.startsWith("0x") || backup.length !== 66)
                    }
                    errorText={backupErrorText}
                  />
                </Flex>
              ))}
            </Flex>
            <Button
              onClick={() => {
                setBackups([...backups, ""]);
              }}
              variant="outline"
              size="sm"
              alignSelf="self-start"
              display={backups.length < 5 ? "block" : "none"}
            >
              Add backup
            </Button>
          </Flex>
          <Button
            alignSelf="flex-end"
            isLoading={isPending}
            onClick={() => {
              mint();
            }}
            className="gradient-border"
            isDisabled={isError}
          >
            Generate your Suitizen Card
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Mint;
