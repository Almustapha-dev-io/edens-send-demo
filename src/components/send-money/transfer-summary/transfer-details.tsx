import { Button, Heading, HStack, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useSendMoneyContext } from '@/context/send-money';
import { formatPrice } from '@/lib/helpers';
import { useAppSelector } from '@/lib/redux';
import { SendMoneyPageState } from '@/types/enums';

import SummaryItem from './summary-item';

export default function TransferDetails() {
  const { setPage } = useSendMoneyContext();
  const { amount, transactionParams, recipientDetails, recipientName } =
    useAppSelector((s) => s.transactionParams.sendMoney);

  const getRecipientName = () => {
    if (!recipientDetails) return '';
    if (recipientDetails.category === 'bank') {
      return recipientName;
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'MTN_MOMO'
    ) {
      return recipientDetails.details.name;
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'EDENS360'
    ) {
      return recipientName;
    }
    return '';
  };

  const recipientValue = useMemo(() => {
    if (!transactionParams) return formatPrice(0, { fractionDigits: 2 });
    if (!amount) return formatPrice(0, { fractionDigits: 2 });

    const params = {
      fractionDigits: 2,
      currency: transactionParams.destinationCurrency,
      locale:
        transactionParams.destinationCurrency === 'USD' ? 'en-US' : 'en-NG',
    };

    const parsedAmount = +amount;
    if (!isFinite(parsedAmount) || isNaN(parsedAmount))
      return formatPrice(0, params);

    return formatPrice(parsedAmount * transactionParams.exchangeRate, params);
  }, [amount, transactionParams]);

  const totalAmount = useMemo(() => {
    if (!transactionParams || !amount)
      return formatPrice(0, { fractionDigits: 2 });

    const parsedAmount = +amount;
    if (!isFinite(parsedAmount) || isNaN(parsedAmount))
      return formatPrice(0, { fractionDigits: 2 });

    const total = parsedAmount + transactionParams.fee;
    return formatPrice(total, {
      fractionDigits: 2,
    });
  }, [amount, transactionParams]);

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
              <span>{totalAmount}</span>

              <Button
                size="sm"
                fontWeight="400"
                fontSize="13px"
                variant="ghost"
                bg="#E9F5F2"
                _hover={{
                  bg: 'primary.50',
                }}
                onClick={() => setPage(SendMoneyPageState.FORM)}
              >
                Change
              </Button>
            </HStack>
          }
        />
        <SummaryItem
          label="Total Fees"
          content={formatPrice(transactionParams?.fee ?? 0, {
            fractionDigits: 2,
          })}
        />
        <SummaryItem
          label={`${getRecipientName()} gets`}
          content={recipientValue}
        />
      </VStack>
    </VStack>
  );
}
