import { Button, Center, Flex, Heading, VStack } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { Else, If, Then } from 'react-if';
import { useParams } from 'react-router-dom';

import ErrorPlaceholder from '@/components/ui/error-placeholder';
import { Loader } from '@/components/ui/loader';
import NoData from '@/components/ui/no-data';
import RouterLink from '@/components/ui/router-link';
import { LOGIN } from '@/constants';
import { useIsAuthenticated } from '@/hooks';
import { useLazyGetTransactionQuery } from '@/lib/redux';

import AirtimeSummary from './airtime-summary';
import CashTransactionSummary from './cash-transaction-summary';

export default function ResendTransaction() {
  const isAuth = useIsAuthenticated();

  const { id } = useParams();
  const [getTransactionQuery, { isFetching, isError, isLoading, data }] =
    useLazyGetTransactionQuery();

  const getTransaction = useCallback(() => {
    if (!id) return;
    getTransactionQuery(id);
  }, [getTransactionQuery, id]);

  useEffect(() => {
    if (isAuth) {
      getTransaction();
    }
  }, [getTransaction, isAuth]);

  if (isAuth && isLoading)
    return (
      <Center w="full" py="6" minH="250px">
        <Loader />
      </Center>
    );

  if (isAuth && isError) {
    return (
      <ErrorPlaceholder retryHandler={getTransaction} isLoading={isFetching} />
    );
  }

  if ((isError || !data) && isAuth) {
    return (
      <NoData
        label="No transaction found!"
        retryHandler={getTransaction}
        isLoading={isFetching}
      />
    );
  }

  return (
    <VStack
      flex="1"
      w="full"
      maxW="full"
      align="flex-start"
      pt="16px"
      spacing="6"
    >
      <Flex
        h="full"
        w="full"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        flex="1"
        direction="column"
        justify="flex-start"
        align="center"
        pos="relative"
      >
        <If condition={isAuth}>
          <Then>
            {!!data && (
              <If condition={data.transaction.type.toLowerCase() === 'airtime'}>
                <Then>
                  <AirtimeSummary transaction={data.transaction} />
                </Then>
                <Else>
                  <CashTransactionSummary transaction={data.transaction} />
                </Else>
              </If>
            )}
          </Then>
          <Else>
            <Center w="full" minH="250px">
              <VStack spacing="4">
                <Heading
                  fontWeight="500"
                  maxW={{ base: '300px', lg: '400px' }}
                  fontSize={{ base: '20px', lg: '24' }}
                  textAlign="center"
                >
                  Login to resend transaction
                </Heading>
                <RouterLink to={LOGIN}>
                  <Button
                    size="lg"
                    minW="150px"
                    variant={{ base: 'outline', lg: 'solid' }}
                  >
                    Login
                  </Button>
                </RouterLink>
              </VStack>
            </Center>
          </Else>
        </If>
      </Flex>
    </VStack>
  );
}
