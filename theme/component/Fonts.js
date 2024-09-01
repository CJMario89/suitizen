import { Global } from "@emotion/react";

export const fontMap = {
  "en-US": "PTSerif",
  "zh-TW": "Iansui",
  "ja-JP": "Iansui",
};

const Fonts = () => {
  return (
    <Global
      styles={`
    @font-face {
      font-family: Iansui;
      font-weight: normal;
      src: url('/assets/fonts/Iansui.ttf') format('truetype');
    }
    @font-face {
      font-family: NotoSerifTC;
      font-weight: normal;
      src: url('/assets/fonts/NotoSerifTC.otf') format('opentype');
    }
    @font-face {
      font-family: PTSerif;
      font-weight: normal;
      src: url('/assets/fonts/PTSerif.ttf') format('truetype');
    }
    `}
    />
  );
};

export default Fonts;
