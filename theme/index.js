import {
  Button,
  Heading,
  Tag,
  Tabs,
  Text,
  Input,
  Link,
  Tooltip,
  IconButton,
  NumberInput,
  Modal,
} from "./component";
import { styles } from "./styles";
import { fontMap } from "./component/Fonts";
import { extendTheme } from "@chakra-ui/react";

const getTheme = (locale) =>
  extendTheme({
    components: {
      Button,
      IconButton,
      Heading,
      Tag,
      Tabs,
      Input,
      Link,
      Tooltip,
      Text,
      NumberInput,
      Modal,
    },
    styles,
    fonts: {
      heading: `${fontMap[locale]}`,
      body: `${fontMap[locale]}`,
    },
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    breakpoints: {
      base: "0px",
      md: "500px",
      lg: "768px",
      xl: "1100px",
    },
    colors: {
      neutral: {
        50: "#FAFAFC",
        100: "#ECECED",
        200: "#DCDCDE",
        300: "#C6C6C9",
        400: "#A4A4A6",
        500: "#727274",
        600: "#49494E",
        700: "#313133",
        800: "#232326",
        900: "#181821",
      },
      darkTheme: {
        50: "#36363C",
        100: "#333339",
        200: "#313136",
        300: "#2F2F32",
        400: "#2A2A2F",
        500: "#25252C",
        600: "#22222A",
        700: "#1F1F26",
        800: "#17171c",
        900: "#111116",
      },
      primary: {
        50: "#afd6ff",
        100: "#7ebcff",
        200: "#6db3ff",
        300: "#4ca2ff",
        400: "#2b91ff",
        500: "#1a88ff",
        600: "#006fe8",
        700: "#030f1c",
        800: "#f7f7f8",
        900: "#4da2ff",
      },
      warning: {
        50: "#FFF5D8",
        100: "#FFE8B1",
        200: "#FFD88A",
        300: "#FFC86D",
        400: "#FFAE3D",
        500: "#DB8A2C",
        600: "#B76A1E",
        700: "#934D13",
        800: "#7A390B",
        900: "#7A390B",
      },
      danger: {
        50: "#FFDCDE",
        100: "#FFBAC4",
        200: "#FF98B2",
        300: "#FF7EAB",
        400: "#FF54A1",
        500: "#DB3D94",
        600: "#B72A86",
        700: "#931A75",
        800: "#7A106A",
        900: "#7A106A",
      },
      error: {
        500: "#FC8181",
      },
    },
    layerStyles: {
      base: {
        bg: "neutral.50",
        color: "neutral.600",
      },
      card: {
        bg: "linear-gradient(135deg, #1C1C24 0%, #1F1F26 100%)",
      },
    },
  });

export default getTheme;
