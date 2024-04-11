import { Box, Center, Flex } from '@chakra-ui/react';
import { PropsWithChildren, useCallback, useEffect } from 'react';

import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { Loader } from '@/components/ui/loader';
import { useIsAuthenticated } from '@/hooks';
import { useLazyGetProfileQuery } from '@/lib/redux';

export default function RootLayout({ children }: PropsWithChildren) {
  const isAuth = useIsAuthenticated();
  const [getUserQuery, { isLoading }] = useLazyGetProfileQuery();

  const getUser = useCallback(() => {
    if (!isAuth) return;
    getUserQuery();
  }, [getUserQuery, isAuth]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <>
      <Center w="full" h="100vh" display={isLoading ? 'flex' : 'none'}>
        <Loader />
      </Center>
      <Flex
        display={isLoading ? 'none' : 'flex'}
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
          pb="80px"
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
    </>
  );
}
