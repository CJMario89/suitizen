import { IconProps } from '@chakra-ui/react';

import SVG from './svg';

const OpenInNew = (props: IconProps) => {
  return (
    <SVG {...props}>
      <path
        fill="currentColor"
        d="M5 21.0166C4.45 21.0166 3.979 20.8209 3.587 20.4296C3.19567 20.0376 3 19.5666 3 19.0166V5.0166C3 4.4666 3.19567 3.9956 3.587 3.6036C3.979 3.21227 4.45 3.0166 5 3.0166H12V5.0166H5V19.0166H19V12.0166H21V19.0166C21 19.5666 20.8043 20.0376 20.413 20.4296C20.021 20.8209 19.55 21.0166 19 21.0166H5ZM9.7 15.7166L8.3 14.3166L17.6 5.0166H14V3.0166H21V10.0166H19V6.4166L9.7 15.7166Z"
      />
    </SVG>
  );
};

export default OpenInNew;
