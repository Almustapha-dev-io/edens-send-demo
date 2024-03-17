import { modalAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const {
  definePartsStyle: defineModalPartsStyle,
  defineMultiStyleConfig: defineModalMultiStyleConfig,
} = createMultiStyleConfigHelpers(modalAnatomy.keys);

const style = defineModalPartsStyle({
  overlay: {
    backdropFilter: 'blur(2px)',
    bg: 'blackAlpha.700',
  },
  dialog: {
    rounded: '15px',
    shadow: '0px 4px 15.199999809265137px 0px #0000000D',
  },
  closeButton: { bg: '#DEE4EB', rounded: 'full' },
});

const modalStyles = defineModalMultiStyleConfig({
  baseStyle: {
    ...style,
  },
});

export default modalStyles;
