import { Button, Heading, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CARD_SHADOW } from '@/constants';
import { useSendAirtimeContext } from '@/context/send-airtime';
import { useInitiateSendAirtime } from '@/hooks';
import { formatNumber, formatPrice, generatePaymentLink } from '@/lib/helpers';
import { resetSendAirtime, useAppDispatch, useAppSelector } from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

export default function TransferSummary() {
  const { onPreviousPage, resetPageState } = useSendAirtimeContext();
  const dispatch = useAppDispatch();
  const { recipientDetails, amount, senderDetails } = useAppSelector(
    (s) => s.transactionParams.sendAirtime
  );

  const recipientValue = useMemo(() => {
    if (!recipientDetails) return 0;
    if (!amount) return 0;

    const parsedAmount = +amount;

    if (!isFinite(parsedAmount) || isNaN(parsedAmount)) return 0;
    return parsedAmount;
  }, [amount, recipientDetails]);

  const { initiateSendAirtimeMutation, data, isSuccess, isLoading } =
    useInitiateSendAirtime({
      hideSuccessMsg: true,
    });
  const triggerRef = useRef<TMutationCreatorResult>();

  const initiateSendAirtime = useCallback(() => {
    if (isLoading || !recipientDetails || !senderDetails) return;

    const product = recipientDetails.network.value.operatorProducts.find(
      (p) => p.productType.name.toLowerCase() === 'mobile top up'
    );
    const productId = product?.id ?? '';

    triggerRef.current = initiateSendAirtimeMutation({
      amount: recipientValue,
      beneficiary_phone_number: recipientDetails.phoneNumber,
      bill_id: recipientDetails.network.value.bill_id,
      bill_provider_id: recipientDetails.network.value.biller_id,
      operator_id: recipientDetails.network.value.operator_id,
      product_id: productId,
    });
  }, [
    initiateSendAirtimeMutation,
    isLoading,
    recipientDetails,
    recipientValue,
    senderDetails,
  ]);

  const recipientValueRef = useRef(recipientValue);
  recipientValueRef.current = recipientValue;

  useEffect(() => {
    if (!isLoading && data && isSuccess) {
      // Navigate to payment gateway
      if (window) {
        window.location.replace(
          generatePaymentLink({
            amount: recipientValueRef.current,
            formattedAmount: formatPrice(recipientValueRef.current, {
              fractionDigits: 2,
            }),
            ref: data.reference,
          })
        );
      }

      resetPageState();
      dispatch(resetSendAirtime());
    }
  }, [data, dispatch, isLoading, isSuccess, resetPageState]);

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
        <RecipientDetails />
        <TransferDetails />

        <VStack w="full" spacing="4">
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant={{ base: 'outline', lg: 'solid' }}
            onClick={initiateSendAirtime}
            isLoading={isLoading}
          >
            Pay {formatNumber(recipientValue, { fractionDigits: 2 })}
          </Button>
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant="ghost"
            onClick={onPreviousPage}
            isDisabled={isLoading}
          >
            Back
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
