import {
  Button,
  Center,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Else, If, Then } from 'react-if';

import RouterLink from '@/components/ui/router-link';
import { LOGIN } from '@/constants';
import { useIsAuthenticated } from '@/hooks';
import { useGetTransactionsQuery } from '@/lib/redux';

import TransactionsTable from './transactions-table';

const items = ['All', 'Money', 'Airtime'];

function TransactionsList() {
  const { isError, isFetching, data, refetch } = useGetTransactionsQuery();

  const cashTransactions = useMemo(() => {
    if (!data) return [];
    return data.transactions.filter((t) => t.type === 'CASH_TRANSFER');
  }, [data]);

  const airtimeTransactions = useMemo(() => {
    if (!data) return [];
    return data.transactions.filter((t) => t.type !== 'CASH_TRANSFER');
  }, [data]);

  return (
    <Tabs w="full" variant="soft-rounded" colorScheme="green">
      <TabList w="full" gap="10px" flexWrap="wrap">
        {items.map((it) => (
          <Tab
            key={it}
            minW="97px"
            border="1px solid #C3CCD6"
            fontWeight="400"
            fontSize="14px"
            _selected={{
              bg: 'primary.500',
              color: '#fff',
              border: 'none',
            }}
          >
            {it}
          </Tab>
        ))}
      </TabList>

      <TabPanels mt="50px" p="0">
        <TabPanel p="0">
          <TransactionsTable
            isError={isError}
            isLoading={isFetching}
            refetch={refetch}
            transactions={data?.transactions ?? []}
          />
        </TabPanel>
        <TabPanel p="0">
          <TransactionsTable
            isError={isError}
            isLoading={isFetching}
            refetch={refetch}
            transactions={cashTransactions}
          />
        </TabPanel>
        <TabPanel p="0">
          <TransactionsTable
            isError={isError}
            isLoading={isFetching}
            refetch={refetch}
            transactions={airtimeTransactions}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default function Transactions() {
  const isAuth = useIsAuthenticated();

  return (
    <VStack flex="1" w="full" maxW="full" align="flex-start" spacing="6">
      <Heading fontWeight="700" fontSize={{ base: '24px', lg: '40px' }}>
        History
      </Heading>

      <If condition={isAuth}>
        <Then>
          <TransactionsList />
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
                Login to view your transaction history
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
