import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

export default defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: 'filled',
    borderColor: 'neutral.100',
  },
  variants: {
    filled: definePartsStyle(() => {
      return {
        field: {
          fontSize: 'sm',
          borderRadius: 'none',
          background: 'transparent',
          border: '0.1px solid',
          borderColor: 'neutral.400',
          _focusVisible: {
            borderColor: 'neutral.100',
            boxShadow: 'none',
          },
          _hover: {
            background: 'transparent',
            borderColor: 'neutral.400',
          },
        },
        addon: {
          ml: 2,
        },
      };
    }),
  },
  sizes: {
    sm: {
      field: {
        px: 2,
        py: 0,
      },
    },
  },
});
