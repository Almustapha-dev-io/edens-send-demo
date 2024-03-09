import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';

import TransactionsTable from './transactions-table';

const transactions: TTransaction[] = [
  {
    amount: 1000,
    beneficiary: 'William Doe',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'mmmudsuduhs1',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 2000,
    beneficiary: 'William Doe',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'mmmuddksd323suduhs2',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
  {
    amount: 1500,
    beneficiary: 'John Smith',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'mslwsd323suduhs3',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 3000,
    beneficiary: 'John Smith',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'mslwsd323sud12uhs4',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
  {
    amount: 1200,
    beneficiary: 'Jane Doe',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'mssud323suduhs5',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 2500,
    beneficiary: 'Jane Doe',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'mssud33suduhs6',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
  {
    amount: 800,
    beneficiary: 'Alice Smith',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'mud323suduhs7',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 1800,
    beneficiary: 'Alice Smith',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'mssud33suduhs8',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
  {
    amount: 1600,
    beneficiary: 'Bob Brown',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'msudsuduhs9',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 2800,
    beneficiary: 'Bob Brown',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'msudssuduhs10',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
  {
    amount: 1600,
    beneficiary: 'Bob Brown',
    beneficiaryNumber: 'Edens360 | 753627282',
    date: new Date().toISOString(),
    id: 'msudsuduhs11',
    status: 'Pending',
    type: 'Money Transfer',
  },
  {
    amount: 2800,
    beneficiary: 'Bob Brown',
    beneficiaryNumber: '+2339283933',
    date: new Date().toISOString(),
    id: 'msudssuduhs12',
    status: 'Completed',
    type: 'Airtime Transfer',
  },
];
const items = ['All', 'Money', 'Airtime'];

export default function Transactions() {
  return (
    <VStack flex="1" w="full" maxW="full" align="flex-start" spacing="6">
      <Heading fontWeight="700" fontSize={{ base: '24px', lg: '40px' }}>
        History
      </Heading>
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
            <TransactionsTable transactions={transactions} />
          </TabPanel>
          <TabPanel p="0">
            <TransactionsTable transactions={transactions} />
          </TabPanel>
          <TabPanel p="0">
            <TransactionsTable transactions={transactions} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
