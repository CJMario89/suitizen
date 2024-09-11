import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

export default defineMultiStyleConfig({
  variants: {
    dark: definePartsStyle({
      overlay: defineStyle({
        background:
          "linear-gradient(180deg, rgba(235, 234, 235, 0.6), rgba(164, 159, 164, 0.6))",
        _dark: {
          background:
            "linear-gradient(180deg, rgba(51, 44, 51, 0.6), rgba(25, 19, 25, 0.6))",
        },
      }),
      content: defineStyle({
        borderRadius: "2xl",
        backgroundColor: "neutral.50",
        boxShadow: "light-mono",
        _dark: {
          boxShadow: "dark-mono",
        },
      }),
      dialog: defineStyle({
        borderRadius: "2xl",
        backgroundColor: "neutral.50",
        boxShadow: "light-mono",
        _dark: {
          backgroundColor: "neutral.900",
          boxShadow: "dark-mono",
        },
      }),
      header: defineStyle({
        color: "neutral.800",
        _dark: {
          color: "neutral.50",
        },
      }),
      body: defineStyle({
        color: "neutral.600",
        _dark: {
          color: "neutral.400",
        },
        px: 6,
      }),
      closeButton: defineStyle({
        color: "neutral.600",
        _dark: {
          color: "neutral.400",
        },
      }),
    }),
  },
  defaultProps: {
    //@ts-expect-error - defaultProps is not extendable but the value is accepted
    isCentered: true,
    variant: "dark",
  },
});
