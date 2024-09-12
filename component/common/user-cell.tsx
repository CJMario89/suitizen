import useGetCardDetail from "@/hooks/use-get-card-detail";
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import Image from "next/image";
import { LinkProps } from "next/link";

const UserCell = ({
  objectId,
  imageContainerProps,
  textProps,
  ...restProps
}: {
  objectId?: string;
  imageContainerProps?: BoxProps;
  textProps?: TextProps;
} & FlexProps &
  LinkProps) => {
  console.log(objectId);
  const { data: card } = useGetCardDetail({
    objectId,
  });

  return (
    <Flex gap="2" alignItems="center" {...restProps}>
      <Box
        w="4"
        h="4"
        borderRadius="full"
        overflow="hidden"
        {...imageContainerProps}
      >
        <Image
          src={card?.cardImg ?? ""}
          alt={card?.lastName ?? ""}
          width={32}
          height={32}
          objectFit="cover"
        />
      </Box>
      <Flex gap="1">
        <Text fontWeight="bold" {...textProps}>
          {card?.firstName}
        </Text>
        <Text fontWeight="bold" {...textProps}>
          {card?.lastName}
        </Text>
      </Flex>
    </Flex>
  );
};

export default UserCell;
