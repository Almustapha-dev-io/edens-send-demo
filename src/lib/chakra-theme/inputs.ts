import { defineStyleConfig } from '@chakra-ui/react';

const inputStyles = defineStyleConfig({
  variants: {
    outline: {
      field: {
        rounded: '10px',
        fontSize: { base: '16px', md: 'sm' },
        _focusVisible: {
          boxShadow: '0 0 0 1px #102E34',
          borderColor: '#102E34',
        },
      },
    },
    filled: {
      field: {
        rounded: '10px',
        fontSize: { base: '16px', md: 'sm' },
        _focusVisible: {
          boxShadow: '0 0 0 1px #102E34',
          borderColor: '#102E34',
        },
      },
    },
  },
});

const textAreaStyles = defineStyleConfig({
  variants: {
    outline: {
      rounded: '10px',
      fontSize: { base: '16px', md: 'sm' },
      _focusVisible: {
        boxShadow: '0 0 0 1px #102E34',
        borderColor: '#102E34',
      },
    },
    filled: {
      rounded: '10px',
      fontSize: { base: '16px', md: 'sm' },
      _focusVisible: {
        boxShadow: '0 0 0 1px #102E34',
        borderColor: '#102E34',
      },
    },
  },
});

export { inputStyles, textAreaStyles };
