import { Flex } from "@chakra-ui/react";
import ConnectButton from "./common/connect-button";
import useGetCard from "@/hooks/use-get-card";
import UserCell from "./common/user-cell";
import Logo from "./common/icon/logo";
import { Dispatch, SetStateAction } from "react";

const headerStyle = {
  bg: "rgba(17, 17, 22, 0.8)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

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
    <Flex
      py={{ base: "2", md: "4" }}
      px={{ base: "4", md: "8" }}
      justifyContent="space-between"
      position="fixed"
      w="full"
      zIndex="100"
      {...(path !== "/" ? headerStyle : {})}
    >
      <Logo
        w="16"
        h="16"
        cursor="pointer"
        onClick={() => {
          setPath("/");
        }}
      />
      {path !== "/" && (
        <Flex gap={{ base: "2", md: "4" }} alignItems="center">
          {isSuitizen && (
            <UserCell
              objectId={card?.objectId}
              imageContainerProps={{
                w: { base: "6", md: "8" },
                h: { base: "6", md: "8" },
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
