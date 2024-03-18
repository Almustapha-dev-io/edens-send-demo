import { Button, Heading, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CARD_SHADOW } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import { useInitiateSendMoney } from '@/hooks';
import { formatPrice, generatePaymentLink } from '@/lib/helpers';
import { resetSendMoney, useAppDispatch, useAppSelector } from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

export default function TransferSummary() {
  const { onPrevioussPage, resetPageState } = useSendMoneyContext();

  const {
    amount,
    transactionParams,
    country,
    recipientDetails,
    recipientEmail,
    recipientName,
    secureTransferDetails,
  } = useAppSelector((s) => s.transactionParams.sendMoney);
  const dispatch = useAppDispatch();

  const totalAmount = useMemo(() => {
    if (!transactionParams || !amount) return 0;

    const parsedAmount = +amount;
    if (!isFinite(parsedAmount) || isNaN(parsedAmount)) return 0;

    return parsedAmount + transactionParams.fee;
  }, [amount, transactionParams]);

  const { initiateSendMoneyMutation, data, isSuccess, isLoading } =
    useInitiateSendMoney({
      hideSuccessMsg: true,
    });

  const triggerRef = useRef<TMutationCreatorResult>();

  const initiateSendMoney = useCallback(() => {
    if (
      isLoading ||
      !recipientDetails ||
      !transactionParams ||
      !secureTransferDetails
    )
      return;

    const getAccountNumber = () => {
      if (recipientDetails.category === 'bank')
        return recipientDetails.details.accountNumber;
      if (recipientDetails.details.walletType === 'EDENS360')
        return recipientDetails.details.walletNumber;
      return recipientDetails.details.phoneNumber;
    };

    const getRecipientName = () => {
      if (recipientDetails.category === 'bank') {
        return recipientName;
      }

      if (recipientDetails.details.walletType === 'MTN_MOMO') {
        return recipientDetails.details.name;
      }

      return recipientName;
    };

    const getEmail = () => {
      if (recipientDetails.category === 'bank') {
        return undefined;
      }

      if (recipientDetails.details.walletType === 'MTN_MOMO') {
        return recipientDetails.details.email;
      }

      if (recipientDetails.details.walletType === 'EDENS360') {
        return recipientEmail;
      }
    };

    const payload: InitiateSendTransactionDTO = {
      amount: totalAmount,
      beneficiary_type: `${country}_${recipientDetails.category.toUpperCase()}`,
      fx_quotation_id: transactionParams.fxQuotationId,
      beneficiary_account_number: getAccountNumber(),
      beneficiary_name: getRecipientName(),
      beneficiary_email: getEmail(),
      narration: recipientDetails.details.narration ?? '',
      purpose_of_transfer:
        secureTransferDetails.transferPurpose === 'others'
          ? (secureTransferDetails.otherTransferPurpose as string)
          : secureTransferDetails.transferPurpose,
      relation_with_beneficiary:
        secureTransferDetails.relationship === 'others'
          ? (secureTransferDetails.otherRelationship as string)
          : secureTransferDetails.relationship,
      source_of_funds:
        secureTransferDetails.sourceOfFunds === 'others'
          ? (secureTransferDetails.otherSourceOfFunds as string)
          : secureTransferDetails.sourceOfFunds,
      sender_country: secureTransferDetails.senderCountry.value,
    };

    if (recipientDetails.category === 'bank') {
      payload.bank_code = recipientDetails.details.bank.value;
    } else {
      payload.wallet_name = recipientDetails.details.walletType;
    }

    triggerRef.current = initiateSendMoneyMutation(payload);
  }, [
    country,
    initiateSendMoneyMutation,
    isLoading,
    recipientDetails,
    recipientEmail,
    recipientName,
    secureTransferDetails,
    totalAmount,
    transactionParams,
  ]);

  const totalAmountRef = useRef(totalAmount);
  totalAmountRef.current = totalAmount;

  useEffect(() => {
    if (!isLoading && data && isSuccess) {
      // Navigate to payment gateway
      if (window) {
        window.location.replace(
          generatePaymentLink({
            amount: totalAmountRef.current,
            formattedAmount: formatPrice(totalAmountRef.current, {
              fractionDigits: 2,
            }),
            ref: data.reference,
          })
        );
      }

      resetPageState();
      dispatch(resetSendMoney());
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
            onClick={initiateSendMoney}
            isLoading={isLoading}
          >
            Pay{' '}
            {formatPrice(totalAmount, {
              fractionDigits: 2,
            })}
          </Button>
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant="ghost"
            onClick={onPrevioussPage}
            isDisabled={isLoading}
          >
            Back
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
