const Tag = {
  baseStyle: {
    container: {
      background: 'primary.100',
      color: 'neutral.800',
      px: '3',
      py: '1',
      borderRadius: 'md',
    },
  },
  sizes: {
    md: {
      h: '36px',
      fontSize: 'md',
      px: '18px',
    },
    lg: {
      h: '48px',
      fontSize: 'lg',
      px: '24px',
    },
    xl: {
      h: '56px',
      fontSize: 'xl',
      px: '32px',
    },
  },
  defaultProps: {
    background: 'neutral.200',
    color: 'neutral.800',
  },
};

export default Tag;
