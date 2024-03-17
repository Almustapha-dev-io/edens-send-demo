import {
  defineStyleConfig,
  extendTheme,
  theme as baseTheme,
  ThemeComponents,
  withDefaultColorScheme,
} from '@chakra-ui/react';

import { APP_FONT } from '@/constants';

import colors from './colors';
import { inputStyles, textAreaStyles } from './inputs';
import modalStyles from './overlays';
import { popoverTheme } from './popper';

const fonts = {
  heading: `'${APP_FONT.headers}', ${baseTheme.fonts.body}`,
  body: `'${APP_FONT.body}', ${baseTheme.fonts.body}`,
};

const components: ThemeComponents = {
  Button: defineStyleConfig({
    baseStyle: {
      fontWeight: 700,
      fontSize: 'sm',
      rounded: 'full',
    },
  }),
  FormLabel: defineStyleConfig({
    baseStyle: {
      fontWeight: 400,
      fontSize: 'sm',
    },
  }),
  Input: inputStyles,
  NumberInput: inputStyles,
  Select: inputStyles,
  Textarea: textAreaStyles,
  Modal: modalStyles,
  Popover: popoverTheme,
};

const chakraTheme = extendTheme(
  {
    colors,
    fonts,
    components,
    styles: {
      global: {
        'html, body': {
          bg: '#fff',
        },
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: 'primary',
  })
);

export default chakraTheme;
