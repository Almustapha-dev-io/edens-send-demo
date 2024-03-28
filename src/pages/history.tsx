import { Flex } from '@chakra-ui/react';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Suspensed } from '@/components/ui/suspensed';

const Transactions = lazy(() => import('@/components/history/transactions'));
const TransactionDetails = lazy(
  () => import('@/components/history/transaction-details')
);
const ResendTransaction = lazy(
  () => import('@/components/history/resend-transaction')
);

export default function History() {
  return (
    <Flex
      h="full"
      w="full"
      maxW="container.xl"
      mx="auto"
      px={{ base: 4, md: 6 }}
      pt="10px"
      flex="1"
      direction="column"
      justify="flex-start"
      align="center"
      pos="relative"
    >
      <Routes>
        <Route
          path=""
          element={
            <Suspensed>
              <Transactions />
            </Suspensed>
          }
        />
        <Route
          path=":id"
          element={
            <Suspensed>
              <TransactionDetails />
            </Suspensed>
          }
        />

        <Route
          path=":id/resend"
          element={
            <Suspensed>
              <ResendTransaction />
            </Suspensed>
          }
        />
      </Routes>
    </Flex>
  );
}
