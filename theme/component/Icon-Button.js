const IconButton = {
  baseStyle: {
    // ...define your base styles
    borderRadius: 'none',
  },
  sizes: {
    sm: {
      h: '32px',
      minW: '32px',
      fontSize: 'xs',
      // px: '16px',
    },
    md: {
      h: '40px',
      fontSize: 'md',
      px: '22px',
    },
    lg: {
      h: '52px',
      fontSize: 'lg',
      px: '28px',
    },
    xl: {
      h: '60px',
      fontSize: 'xl',
      px: '36px',
    },
  },
  variants: {
    outline: {
      border: '0.11px solid',
      borderColor: 'neutral.500',
      color: 'neutral.50',
      _hover: {
        bgColor: 'darkTheme.600',
        _disabled: {
          borderColor: 'neutral.500',
          color: 'neutral.500',
        },
      },
    },
    solid: {
      bgColor: 'neutral.50',
      color: 'darkTheme.800',
      _hover: {
        bgColor: 'neutral.100',
        _disabled: {
          bgColor: 'neutral.500',
          color: 'darkTheme.900',
        },
      },
    },

    ghost: {
      color: 'neutral.50',
      bgColor: 'darkTheme.400',
      _hover: {
        bgColor: 'darkTheme.300',
      },
      _active: {
        bgColor: 'darkTheme.100',
      },
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'ghost',
  },
};

export default IconButton;
