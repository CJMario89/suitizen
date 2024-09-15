import useGetNameService, { NameService } from "@/hooks/use-get-name-service";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { getAnimationStyle } from "./animation-style";
import Image from "next/image";

const NameServiceBlock = ({
  step,
  selectedNameService,
  onSelected,
  onConfirm,
}: {
  step: number;
  selectedNameService?: NameService;
  onSelected: (nameService?: NameService) => void;
  onConfirm: () => void;
}) => {
  const { data, isPending, refetch, isFetching } = useGetNameService();

  return (
    <Flex
      position="absolute"
      w="full"
      flexDirection="column"
      gap="4"
      h="full"
      layerStyle="card"
      justifyContent="space-between"
      {...getAnimationStyle(0, step)}
    >
      <Flex gap="4" h="full" flexWrap="wrap" maxH="500px" overflow="auto" p="4">
        {!isPending && data?.length === 0 && (
          <Flex
            flexDirection="column"
            flex="1"
            gap="4"
            w="full"
            h="full"
            alignItems="center"
            justifyContent="center"
          >
            <Heading as="h3" color="white" textAlign="center">
              No name service found
            </Heading>
            <Link
              href="https://testnet.suins.io/"
              color="primary.300"
              fontSize="lg"
              target="_blank"
            >
              Go to buy a name service
            </Link>
          </Flex>
        )}
        {data?.map((object) => (
          <Box
            key={object.objectId}
            as="button"
            w="150px"
            h="150px"
            onClick={() => {
              onSelected(object);
            }}
            border="3px solid"
            _hover={{
              transform: "scale(1.05)",
            }}
            borderColor={
              selectedNameService?.domainName === object.domainName
                ? "blue.500"
                : "transparent"
            }
            borderRadius="xl"
            transition="all 0.3s ease-in-out"
          >
            {object.imageUrl && object.domainName && (
              <Image
                src={object.imageUrl}
                alt={object.domainName}
                width="150"
                height="150"
              />
            )}
          </Box>
        ))}
      </Flex>
      <Flex gap="2" justifyContent="flex-end" alignItems="center" p="4">
        <Button
          variant="outline"
          onClick={() => {
            refetch();
          }}
          isLoading={isFetching}
        >
          Refresh
        </Button>
        <Button
          variant="solid"
          onClick={() => {
            onConfirm();
          }}
          alignSelf="flex-end"
          isDisabled={!selectedNameService}
        >
          Confirm
        </Button>
      </Flex>
    </Flex>
  );
};

export default NameServiceBlock;
