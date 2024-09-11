import useGetCardDetail from "@/hooks/use-get-card-detail";
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Skeleton,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { useAutoConnectWallet, useCurrentWallet } from "@mysten/dapp-kit";
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
  const { data: card, isPending } = useGetCardDetail({
    objectId,
  });
  const { connectionStatus } = useCurrentWallet();
  const autoConnectStatus = useAutoConnectWallet();
  const isConnecting = autoConnectStatus !== "attempted";

  return (
    <>
      {isConnecting && isPending && (
        <Skeleton w="8" h="8" borderRadius="full" />
      )}
      {!isConnecting && !isPending && (
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
      )}
    </>
  );
};

export default UserCell;
