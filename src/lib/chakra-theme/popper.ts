import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const custom = definePartsStyle({
  popper: defineStyle({
    zIndex: 15,
  }),
});

export const popoverTheme = defineMultiStyleConfig({
  variants: { custom },
});
