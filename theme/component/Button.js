const Button = {
  baseStyle: {
    // ...define your base styles
    // borderRadius: "md",
    borderRadius: "full",
    fontWeight: "bold",
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
      h: "36px",
      fontSize: "sm",
      px: "24px",
    },
    lg: {
      h: "48px",
      fontSize: "lg",
      px: "32px",
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
      bgColor: "primary.400",
      color: "neutral.50",
      _hover: {
        boxShadow: "0px 0px 10px #afd6ff",
        bgColor: "primary.300",
        _disabled: {
          bgColor: "primary.400",
          color: "neutral.200",
          boxShadow: "none",
        },
      },
      _active: {
        bgColor: "primary.100",
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
    variant: "solid",
  },
};

export default Button;
