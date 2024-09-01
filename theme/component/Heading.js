const headingSizeMap = {
  '3xl': { fontSize: ['4xl', null, '5xl'] },
  '2xl': { fontSize: ['3xl', null, '4xl'] },
  xl: { fontSize: ['2xl', null, '3xl'] },
  lg: { fontSize: ['xl', null, '2xl'] },
  md: { fontSize: ['lg', null, 'xl'] },
};
const getHeadingSize = (as) => {
  switch (as) {
    case 'h1':
      return headingSizeMap['3xl'];
    case 'h2':
      return headingSizeMap['2xl'];
    case 'h3':
      return headingSizeMap['xl'];
    case 'h4':
      return headingSizeMap['lg'];
    case 'h5':
      return headingSizeMap['md'];
    default:
      return headingSizeMap['md'];
  }
};
const Heading = {
  baseStyle: {
    fontWeight: 'bold',
    color: 'neutral.50',
  },
  sizes: {
    auto: ({ as }) => getHeadingSize(as),
  },
  defaultProps: {
    size: 'auto',
  },
};

export default Heading;
