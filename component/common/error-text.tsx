import { Text } from "@chakra-ui/react";

const ErrorText = ({
  isError,
  errorText,
}: {
  isError: boolean;
  errorText: string;
}) => {
  return (
    <Text
      color="error.500"
      fontWeight="medium"
      fontSize="sm"
      display={isError ? "block" : "none"}
    >
      {errorText}
    </Text>
  );
};

export default ErrorText;
