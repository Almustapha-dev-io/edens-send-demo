import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Case, Switch } from 'react-if';

import AmountForm from '@/components/send-airtime/amount-form';
import RecipientDetails from '@/components/send-airtime/recipient-details';
import SenderDetails from '@/components/send-airtime/sender-details';
import TransferSummary from '@/components/send-airtime/transfer-summary';
import { useSendAirtimeContext } from '@/context/send-airtime';
import { useIsAuthenticated, useWillUnmount } from '@/hooks';
import { resetSendAirtime, useAppDispatch } from '@/lib/redux';
import { SendAirtimePageState } from '@/types/enums';

export default function SendAirtime() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const { pageState, setPage } = useSendAirtimeContext();
  const isAuth = useIsAuthenticated();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuth && pageState === SendAirtimePageState.SUMMARY) {
      setPage(SendAirtimePageState.SENDER_DETAILS);
    }
  }, [isAuth, pageState, setPage]);

  useWillUnmount(() => {
    dispatch(resetSendAirtime());
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
        pt={{ base: '16px', lg: '20px' }}
        flex="1"
        direction="column"
        justify="flex-start"
        align="center"
        pos="relative"
      >
        <Switch>
          <Case
            condition={pageState === SendAirtimePageState.RECIPIENT_DETAILS}
          >
            <RecipientDetails />
          </Case>
          <Case condition={pageState === SendAirtimePageState.AMOUNT_FORM}>
            <AmountForm />
          </Case>
          <Case condition={pageState === SendAirtimePageState.SENDER_DETAILS}>
            <SenderDetails />
          </Case>
          <Case condition={pageState === SendAirtimePageState.SUMMARY}>
            <TransferSummary />
          </Case>
        </Switch>
      </Flex>
    </>
  );
}
