import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { getAnimationStyle } from "./animation-style";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Loading from "/assets/loading.gif";
import IconClose from "../common/icon/close";
import ErrorText from "../common/error-text";

const Backup = ({
  backups,
  step,
  setBackups,
  isPreparing,
  onSuccess,
}: {
  backups: string[];
  step: number;
  isPreparing: boolean;
  setBackups: Dispatch<SetStateAction<string[]>>;
  onSuccess: () => void;
}) => {
  const isError = backups.some((b) => !b.startsWith("0x") || b.length !== 66);

  const backupErrorText = "Invalid backup address";
  return (
    <Flex
      position="absolute"
      w="full"
      flexDirection="column"
      gap="8"
      h="full"
      bg="darkTheme.700"
      justifyContent="space-between"
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
          <Heading as="h4" textAlign="center">
            Preparing your Suitizen Card
          </Heading>
          <Image src={Loading} alt="loading" width="80" height="80" />
        </Flex>
      ) : (
        <Flex gap="4" flexDirection="column">
          <Heading as="h4" alignSelf="self-start">
            Backup your Suitizen Card
          </Heading>
          <Text alignSelf="self-start">
            Your Suitizen Card is a unique digital identity. To ensure you wont
            potentially lose access to your Suitizen Card, please backup the
            Address to your transfer wallet. (up to 5 backups)
          </Text>
          <Flex
            gap="2"
            flexDirection="column"
            maxH={{
              base: "150px",
              md: "300px",
            }}
            overflow="auto"
          >
            {backups.map((backup, index) => (
              <Flex key={index} gap="2" flexDirection="column">
                <Flex gap="1">
                  <Text>backup address</Text>
                  <Text color="error.500">*</Text>
                </Flex>

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
            variant="ghost"
            onClick={() => {
              setBackups([...backups, ""]);
            }}
            alignSelf="self-start"
          >
            Add backup address
          </Button>
        </Flex>
      )}
      {!isPreparing && (
        <Button
          onClick={() => {
            onSuccess();
          }}
          alignSelf="self-end"
          isDisabled={isError}
        >
          Comfirm
        </Button>
      )}
    </Flex>
  );
};

export default Backup;
