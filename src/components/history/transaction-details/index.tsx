import { Heading, Stack, useBreakpointValue, VStack } from '@chakra-ui/react';

import BackButton from '@/components/ui/back-button';
import RouterLink from '@/components/ui/router-link';
import { HISTORY_ROUTE } from '@/constants';

import TransactionStatus from '../transactions/transaction-status';
import TransactionDetailsLg from './transaction-details-lg';
import TransactionDetailsSm from './transaction-details-sm';

const dummyTr: TTransaction = {
  amount: 1000,
  beneficiary: 'William Doe',
  beneficiaryNumber: 'Edens360 | 753627282',
  date: new Date().toISOString(),
  id: 'mmmudsuduhs1',
  status: 'Pending',
  type: 'Money Transfer',
};

export default function TransactionDetails() {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  let content = <></>;
  if (isSmallScreen) {
    content = <TransactionDetailsSm transaction={dummyTr} />;
  } else {
    content = <TransactionDetailsLg transaction={dummyTr} />;
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

        <TransactionStatus status={dummyTr.status} />
      </Stack>

      {content}
    </VStack>
  );
}
