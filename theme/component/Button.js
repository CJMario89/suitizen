const Button = {
  baseStyle: {
    // ...define your base styles
    borderRadius: "md",
    // borderRadius: 'none',
  },
  sizes: {
    sm: {
      h: "32px",
      minW: "32px",
      fontSize: "xs",
      px: "16px",
    },
    md: {
      h: "32px",
      fontSize: "sm",
      px: "18px",
    },
    lg: {
      h: "52px",
      fontSize: "lg",
      px: "28px",
    },
    xl: {
      h: "60px",
      fontSize: "xl",
      px: "36px",
    },
  },
  variants: {
    outline: {
      border: "0.1px solid",
      borderColor: "neutral.400",
      color: "neutral.50",
      _hover: {
        bgColor: "darkTheme.600",
        _disabled: {
          borderColor: "neutral.500",
          color: "neutral.500",
        },
      },
    },
    solid: {
      bgColor: "neutral.50",
      color: "darkTheme.800",
      _hover: {
        bgColor: "neutral.100",
        _disabled: {
          bgColor: "neutral.500",
          color: "darkTheme.900",
        },
      },
    },

    ghost: {
      color: "neutral.50",
      bgColor: "darkTheme.400",
      _hover: {
        bgColor: "darkTheme.200",
      },
      _active: {
        bgColor: "darkTheme.100",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "ghost",
  },
};

export default Button;
