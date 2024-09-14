import { Flex } from "@chakra-ui/react";
import ConnectButton from "./common/connect-button";
import useGetCard from "@/hooks/use-get-card";
import UserCell from "./common/user-cell";
import Logo from "./common/icon/logo";
import { Dispatch, SetStateAction } from "react";

const Header = ({
  path,
  setPath,
}: {
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
}) => {
  const { data } = useGetCard();
  const card = data?.[0];
  const isSuitizen = !!card;
  return (
    <Flex py="4" px="8" justifyContent="space-between">
      <Logo
        w="16"
        h="16"
        onClick={() => {
          setPath("/");
        }}
      />
      {path !== "/" && (
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
              onClick={() => {
                setPath("/app");
              }}
              cursor="pointer"
            />
          )}
          <ConnectButton />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
