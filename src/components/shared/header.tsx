import {
  Box,
  Button,
  HStack,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';

import CircleUserIcon from '../icons/circle-user-icon';
import RouterLink from '../ui/router-link';
import NavigationTab from './navigation-tab';

export default function Header() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });

  return (
    <Box
      as="header"
      w="full"
      pos="fixed"
      top="0"
      zIndex="11"
      bg={{ base: '#fff', md: '#F4FAF9' }}
    >
      <HStack
        w="full"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py="5"
        justify="space-between"
        align="center"
      >
        <RouterLink to="/money">
          <Image
            src="/assets/images/logo-full.svg"
            maxH={{ base: '26px', md: '35.36px' }}
          />
        </RouterLink>

        <HStack align="center" spacing="16px">
          {isLargeScreen && <NavigationTab />}

          <RouterLink to="?login=true">
            <Button size="md" variant="link" leftIcon={<CircleUserIcon />}>
              Login
            </Button>
          </RouterLink>
        </HStack>
      </HStack>
    </Box>
  );
}
