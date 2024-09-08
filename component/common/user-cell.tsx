import useGetCardDetail from "@/hooks/use-get-card-detail";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

const UserCell = ({ objectId }: { objectId?: string }) => {
  const { data: card } = useGetCardDetail({
    objectId,
  });

  return (
    <Flex gap="2" alignItems="center">
      <Box w="4" h="4" borderRadius="full" overflow="hidden">
        <Image
          src={card?.cardImg ?? ""}
          alt={card?.lastName ?? ""}
          width={16}
          height={16}
          objectFit="cover"
        />
      </Box>
      <Text fontWeight="bold">{card?.lastName}</Text>
    </Flex>
  );
};

export default UserCell;
