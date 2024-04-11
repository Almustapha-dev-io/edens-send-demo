import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const {
  definePartsStyle: defineMenuPartStyle,
  defineMultiStyleConfig: defineMenuMultiStyleConfig,
} = createMultiStyleConfigHelpers(menuAnatomy.keys);

const menuStyle = defineMenuPartStyle({
  item: {
    _hover: { bg: '#DEE4EB' },
    _focus: { bg: '#DEE4EB' },
    fontWeight: 'normal',
    py: '3',
  },
  list: {
    borderWidth: '0px',
    shadow: 'md',
    py: '4',
    rounded: 'none',
  },
});

export { defineMenuMultiStyleConfig, menuStyle };
