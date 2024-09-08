import { createIcon } from '@chakra-ui/react';

const IconCheck = createIcon({
  displayName: 'check',
  viewBox: '0 0 16 16',
  path: (
    <path
      fill="currentColor"
      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
    />
  ),
  defaultProps: {
    width: '4',
    height: '4',
  },
});

export default IconCheck;
