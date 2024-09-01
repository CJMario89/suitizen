import { numberInputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys);

export default defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: 'filled',
    //@ts-expect-error - defaultProps is not extendable but the value is accepted
    errorBorderColor: 'error.400',
  },
  variants: {
    filled: definePartsStyle(() => {
      return {
        field: {
          borderRadius: 'none',
          borderWidth: '0.1px',
          borderColor: 'neutral.500',
          background: 'darkTheme.700',
          _hover: {
            background: 'darkTheme.600',
          },
          _focus: {
            background: 'darkTheme.600',
            borderColor: 'neutral.50',
          },
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
    md: {
      field: {
        px: 2,
        py: 0,
      },
    },
  },
});
