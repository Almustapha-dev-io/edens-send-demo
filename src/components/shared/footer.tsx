import { Box, HStack, Link, Text, useBreakpointValue } from '@chakra-ui/react';

import { privacyPolicy, termsUrl } from '@/lib/env';

import NavigationTab from './navigation-tab';

export default function Footer() {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  if (isMobile)
    return (
      <Box
        as="footer"
        w="full"
        pos="fixed"
        bottom="0"
        zIndex="11"
        pt="1"
        px="1"
        pb="3"
        bg={{ base: '#fff', md: '#F4FAF9' }}
      >
        <NavigationTab />
      </Box>
    );

  return (
    <Box w="full" as="footer" bg="#F4FAF9">
      <HStack
        w="full"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        pt="4"
        pb="6"
        justify="space-between"
        align="center"
      >
        <HStack spacing="6">
          <Link isExternal href={termsUrl}>
            Terms & Conditions
          </Link>
          <Link isExternal href={privacyPolicy}>
            Privacy Policy
          </Link>
        </HStack>
        <Text color="#C0C0C0" fontWeight="400">
          All Rights Reserved - {new Date().getFullYear()} &copy;Edens360
        </Text>
      </HStack>
    </Box>
  );
}
