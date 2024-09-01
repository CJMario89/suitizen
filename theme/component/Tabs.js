import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

export default defineMultiStyleConfig({
  defaultProps: {},
  baseStyle: {
    tablist: {
      overflowX: "auto",
      overflowY: "hidden",
    },
    tab: {
      flexShrink: 0,
    },
    tabpanel: {
      px: "0",
    },
  },
  variants: {
    line: definePartsStyle({
      tablist: {
        borderBottomWidth: "1px",
      },
      tab: {
        fontWeight: "semibold",
        _active: {
          bgColor: "primary.50",
          color: "neutral.800",
        },
        _hover: {
          color: "neutral.700",
        },
        _selected: {
          borderColor: "primary.600",
          color: "primary.600 !important",
        },
        color: "neutral.600",
        borderBottomWidth: "1px",
        borderTopRightRadius: "lg",
        borderTopLeftRadius: "lg",
        transition: "all 0.3s ease-in-out",
      },
    }),
  },
});
