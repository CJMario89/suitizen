import { Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
import ConnectButton from "./common/connect-button";
import useGetCard from "@/hooks/use-get-card";
import { useCurrentAccount } from "@mysten/dapp-kit";
import UserCell from "./common/user-cell";
import Logo from "./common/icon/logo";

const Header = ({ noWallet }: { noWallet?: boolean }) => {
  const { data } = useGetCard();
  const card = data?.[0];
  const isSuitizen = !!card;
  return (
    <Flex py="4" px="8" justifyContent="space-between">
      <Link href="/">
        <Logo w="16" h="16" />
      </Link>
      {!noWallet && (
        <Flex gap="4" alignItems="center">
          {isSuitizen && (
            <UserCell
              objectId={card?.objectId}
              imageContainerProps={{
                w: "8",
                h: "8",
              }}
              textProps={{
                fontSize: "md",
              }}
              as={Link}
              href="/app"
            />
          )}
          <ConnectButton />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
