import { Box, Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Flex
      w="full"
      minH="100vh"
      direction="column"
      justify="flex-start"
      align="flex-start"
    >
      <Header />
      <Box
        as="main"
        w="full"
        pt={{ base: '66px', md: '91px' }}
        py="80px"
        flex="1"
        display="flex"
        flexDirection="column"
        bg={{ base: '#fff', md: '#F4FAF9' }}
        pos="relative"
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
