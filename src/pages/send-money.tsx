import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Case, Switch } from 'react-if';

import RecipientDetails from '@/components/send-money/recipient-details';
import SecureTransfer from '@/components/send-money/secure-transfer';
import SendMoneyForm from '@/components/send-money/send-money-form';
import SenderDetails from '@/components/send-money/sender-details';
import TransferSummary from '@/components/send-money/transfer-summary';
import { useSendMoneyContext } from '@/context/send-money';
import { useIsAuthenticated, useWillUnmount } from '@/hooks';
import { resetSendMoney, useAppDispatch } from '@/lib/redux';
import { SendMoneyPageState } from '@/types/enums';

export default function SendMoney() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const { pageState, setPage } = useSendMoneyContext();
  const isAuth = useIsAuthenticated();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      !isAuth &&
      (pageState === SendMoneyPageState.SECURE_DETAILS ||
        pageState === SendMoneyPageState.SUMMARY)
    ) {
      setPage(SendMoneyPageState.SENDER_DETAILS);
    }
  }, [isAuth, pageState, setPage]);

  useWillUnmount(() => {
    dispatch(resetSendMoney());
  });

  return (
    <>
      {isLargeScreen && (
        <>
          <Image
            pos="fixed"
            alt="pattern-left"
            src="/assets/images/ovals-left.svg"
            left="0"
            top="20%"
            maxH={{ lg: '300px', xl: '400px' }}
          />

          <Image
            pos="fixed"
            alt="pattern=right"
            src="/assets/images/ovals-right.svg"
            right="0"
            top="35%"
            maxH={{ lg: '300px', xl: '400px' }}
          />
        </>
      )}

      <Flex
        h="full"
        w="full"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        pt={{ base: '16px', lg: '60px' }}
        flex="1"
        direction="column"
        justify="flex-start"
        align="center"
        pos="relative"
      >
        <Switch>
          <Case condition={pageState === SendMoneyPageState.FORM}>
            <SendMoneyForm />
          </Case>
          <Case condition={pageState === SendMoneyPageState.RECIPIENT_DETAILS}>
            <RecipientDetails />
          </Case>
          <Case condition={pageState === SendMoneyPageState.SENDER_DETAILS}>
            <SenderDetails />
          </Case>
          <Case condition={pageState === SendMoneyPageState.SECURE_DETAILS}>
            <SecureTransfer />
          </Case>
          <Case condition={pageState === SendMoneyPageState.SUMMARY}>
            <TransferSummary />
          </Case>
        </Switch>
      </Flex>
    </>
  );
}
