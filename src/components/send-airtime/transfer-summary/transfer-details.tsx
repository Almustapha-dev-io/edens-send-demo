import { Button, Heading, HStack, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useSendAirtimeContext } from '@/context/send-airtime';
import { formatNumber } from '@/lib/helpers';
import { useAppSelector } from '@/lib/redux';
import { SendAirtimePageState } from '@/types/enums';

import SummaryItem from './summary-item';

export default function TransferDetails() {
  const { setPage } = useSendAirtimeContext();
  const { recipientDetails, amount } = useAppSelector(
    (s) => s.transactionParams.sendAirtime
  );

  const recipientValue = useMemo(() => {
    if (!recipientDetails) return 0;
    if (!amount) return 0;

    const parsedAmount = +amount;

    if (!isFinite(parsedAmount) || isNaN(parsedAmount)) return 0;
    return parsedAmount;
  }, [amount, recipientDetails]);

  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Transfer Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem
          label="You send exactly"
          content={
            <HStack w="full" justify="space-between">
              <span>{formatNumber(recipientValue, { fractionDigits: 2 })}</span>

              <Button
                size="sm"
                fontWeight="400"
                fontSize="13px"
                variant="ghost"
                bg="#E9F5F2"
                _hover={{
                  bg: 'primary.50',
                }}
                onClick={() => setPage(SendAirtimePageState.AMOUNT_FORM)}
              >
                Change
              </Button>
            </HStack>
          }
        />
        <SummaryItem label="Total Fees" content="0.00" />
        <SummaryItem
          label={`${recipientDetails?.phoneNumber ?? '-'} gets`}
          content={formatNumber(recipientValue, { fractionDigits: 2 })}
        />
      </VStack>
    </VStack>
  );
}
