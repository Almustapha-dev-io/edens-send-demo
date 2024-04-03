import { Button, Heading, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import RouterLink from '@/components/ui/router-link';
import { CARD_SHADOW } from '@/constants';
import { useInitiateSendAirtime } from '@/hooks';
import { formatPrice, generatePaymentLink } from '@/lib/helpers';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

type Props = {
  transaction: TTransaction;
};

export default function AirtimeSummary({ transaction }: Props) {
  const formattedAmount = useMemo(
    () => ({
      amount:
        isNaN(+transaction.amount) || !isFinite(+transaction.amount)
          ? 0
          : +transaction.amount / 100,
      fee:
        isNaN(+transaction.fee) || !isFinite(+transaction.fee)
          ? 0
          : +transaction.fee / 100,
    }),
    [transaction.amount, transaction.fee]
  );

  const { initiateSendAirtimeMutation, data, isSuccess, isLoading } =
    useInitiateSendAirtime({
      hideSuccessMsg: true,
    });
  const triggerRef = useRef<TMutationCreatorResult>();

  const initiateSendAirtime = useCallback(() => {
    if (isLoading) return;

    triggerRef.current = initiateSendAirtimeMutation({
      amount: formattedAmount.amount,
      beneficiary_phone_number: transaction.beneficiary_phone_number ?? '',
      bill_id: transaction.bill_id ?? '',
      bill_provider_id: transaction.bill_provider_id ?? '',
      operator_id: transaction.operator_id ?? '',
      product_id: transaction.product_id ?? '',
    });
  }, [
    formattedAmount.amount,
    initiateSendAirtimeMutation,
    isLoading,
    transaction.beneficiary_phone_number,
    transaction.bill_id,
    transaction.bill_provider_id,
    transaction.operator_id,
    transaction.product_id,
  ]);

  const parsedAmountRef = useRef(formattedAmount);
  parsedAmountRef.current = formattedAmount;

  useEffect(() => {
    if (!isLoading && data && isSuccess) {
      if (window) {
        window.location.replace(
          generatePaymentLink({
            amount: parsedAmountRef.current.amount,
            formattedAmount: (
              parsedAmountRef.current.amount + parsedAmountRef.current.fee
            ).toFixed(2),
            ref: data.reference,
          })
        );
      }
    }
  }, [data, isLoading, isSuccess]);

  return (
    <VStack w="519px" maxW="full" spacing="6">
      <Heading
        as="h1"
        fontSize={{ base: '24px', md: '36px' }}
        fontWeight="700"
        textAlign="center"
      >
        See your transfer summary
      </Heading>

      <VStack
        align="flex-start"
        w="full"
        shadow={{ base: 'none', lg: CARD_SHADOW }}
        rounded={{ base: 'none', lg: '20px' }}
        bg={{ base: 'transparent', lg: '#fff' }}
        spacing="8"
        px={{ base: 0, lg: '30px' }}
        py={{ base: 2, md: 10 }}
      >
        <RecipientDetails
          accountName={transaction.beneficiary_name ?? '-'}
          accountNumber={
            transaction.beneficiary_phone_number
              ? `${transaction.beneficiary_phone_number} | Airtime`
              : '-'
          }
          emailAddress={transaction.beneficiary_email ?? '-'}
        />

        <TransferDetails
          type="airtime"
          amount={formattedAmount.amount}
          fee={formattedAmount.fee}
          recipientName={transaction.beneficiary_name ?? '-'}
        />

        <VStack w="full" spacing="4">
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant={{ base: 'outline', lg: 'solid' }}
            onClick={initiateSendAirtime}
            isLoading={isLoading}
          >
            Pay{' '}
            {formatPrice(formattedAmount.amount + formattedAmount.fee, {
              fractionDigits: 2,
            })}
          </Button>
          <RouterLink w="full" to=".." relative="path">
            <Button
              size="lg"
              fontSize="14px"
              w="full"
              variant="ghost"
              isDisabled={isLoading}
            >
              Back
            </Button>
          </RouterLink>
        </VStack>
      </VStack>
    </VStack>
  );
}
