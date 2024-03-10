import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { Case, Switch } from 'react-if';

import RecipientDetails from '@/components/send-money/recipient-details';
import SendMoneyForm from '@/components/send-money/send-money-form';
import SenderDetails from '@/components/send-money/sender-details';
import TransferSummary from '@/components/send-money/transfer-summary';
import { useSendMoneyContext } from '@/context/send-money';
import { SendMoneyPageState } from '@/types/enums';

export default function SendMoney() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const { pageState } = useSendMoneyContext();

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
          <Case condition={pageState === SendMoneyPageState.SUMMARY}>
            <TransferSummary />
          </Case>
        </Switch>
      </Flex>
    </>
  );
}
