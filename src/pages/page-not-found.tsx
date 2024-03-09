import { Button, Center, Heading, Image, VStack } from '@chakra-ui/react';

import RouterLink from '@/components/ui/router-link';
import { SEND_MONEY_ROUTE } from '@/constants';

export default function PageNotFound() {
  return (
    <Center
      h="full"
      w="full"
      flex="1"
      alignItems="flex-start"
      px={{ base: 4, md: 6 }}
    >
      <VStack w="400px" maxW="full" mt="8">
        <Image
          alt="404"
          src="/assets/images/404-animated.svg"
          maxH={{ base: '350px', md: '400px' }}
        />

        <VStack w="250px" spacing="4">
          <Heading fontSize="16px" fontWeight="600">
            Page not found!
          </Heading>
          <RouterLink to={SEND_MONEY_ROUTE} replace w="full">
            <Button
              w="full"
              size="lg"
              fontSize="14px"
              variant={{ base: 'outline', lg: 'solid' }}
            >
              Go home
            </Button>
          </RouterLink>
        </VStack>
      </VStack>
    </Center>
  );
}
