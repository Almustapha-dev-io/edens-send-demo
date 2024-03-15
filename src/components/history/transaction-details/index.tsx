import {
  Button,
  Center,
  Heading,
  Stack,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { Else, If, Then } from 'react-if';

import BackButton from '@/components/ui/back-button';
import RouterLink from '@/components/ui/router-link';
import { HISTORY_ROUTE, LOGIN } from '@/constants';
import { useIsAuthenticated } from '@/hooks';

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
  const isAuth = useIsAuthenticated();

  let content = <></>;
  if (isSmallScreen && isAuth) {
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

        {isAuth && <TransactionStatus status={dummyTr.status} />}
      </Stack>

      <If condition={isAuth}>
        <Then>{content}</Then>
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
