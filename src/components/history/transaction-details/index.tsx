import {
  Button,
  Center,
  Heading,
  Stack,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { Else, If, Then } from 'react-if';
import { useParams } from 'react-router-dom';

import BackButton from '@/components/ui/back-button';
import ErrorPlaceholder from '@/components/ui/error-placeholder';
import { Loader } from '@/components/ui/loader';
import NoData from '@/components/ui/no-data';
import RouterLink from '@/components/ui/router-link';
import { HISTORY_ROUTE, LOGIN } from '@/constants';
import { useIsAuthenticated } from '@/hooks';
import { useLazyGetTransactionQuery } from '@/lib/redux';

import TransactionStatus from '../transactions/transaction-status';
import TransactionDetailsLg from './transaction-details-lg';
import TransactionDetailsSm from './transaction-details-sm';

export default function TransactionDetails() {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });
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
    <VStack flex="1" w="full" maxW="full" align="flex-start" spacing="6">
      <RouterLink to={HISTORY_ROUTE}>
        <BackButton />
      </RouterLink>

      <Stack
        w="full"
        spacing="6"
        direction={{ base: 'row', lg: 'column' }}
        justify={{ base: 'space-between', lg: 'flex-start' }}
        align={{ base: 'center', lg: 'flex-start' }}
      >
        <Heading fontWeight="700" fontSize={{ base: '24px', lg: '40px' }}>
          Transaction details
        </Heading>

        <If condition={isAuth}>
          <Then>
            {!!data && <TransactionStatus status={data.transaction.status} />}
          </Then>
        </If>
      </Stack>

      <If condition={isAuth}>
        <Then>
          <If condition={isSmallScreen}>
            <Then>
              {!!data && (
                <TransactionDetailsSm transaction={data.transaction} />
              )}
            </Then>
            <Else>
              {!!data && (
                <TransactionDetailsLg transaction={data.transaction} />
              )}
            </Else>
          </If>
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
                Login to view your transaction details
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
    </VStack>
  );
}
