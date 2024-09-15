import useGetCardDetail from "@/hooks/use-get-card-detail";
import { Box, Flex, Text, TextProps } from "@chakra-ui/react";
import Image from "next/image";

const UserCommentCell = ({
  objectId,
  content,
  commentProps,
}: {
  objectId?: string;
  content: string;
  commentProps?: TextProps;
}) => {
  const { data: card } = useGetCardDetail({
    objectId,
  });

  return (
    <Flex gap="2">
      <Box
        w="5"
        h="5"
        borderRadius="full"
        overflow="hidden"
        flexShrink="0"
        mt="1"
      >
        <Image
          src={card?.pfpImg ?? ""}
          alt={card?.lastName ?? ""}
          width={20}
          height={20}
          objectFit="cover"
        />
      </Box>
      <Flex flexDirection="column">
        <Flex gap="1">
          <Text fontWeight="bold">{card?.firstName}</Text>
          <Text fontWeight="bold">{card?.lastName}</Text>
        </Flex>
        <Text {...commentProps}>{content}</Text>
      </Flex>
    </Flex>
  );
};

export default UserCommentCell;
