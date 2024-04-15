/* eslint-disable @typescript-eslint/indent */
import { Button, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import RouterLink from '@/components/ui/router-link';
import { CARD_SHADOW } from '@/constants';
import { useCreateTransactionsParams, useInitiateSendMoney } from '@/hooks';
import { formatPrice, generatePaymentLink, snakeToFlat } from '@/lib/helpers';
import { TTransactionParamsRes } from '@/lib/redux/slices/api-slice/builders';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

import ChangeAmount from './change-amount';
import ExchangeRateUpdate from './exchange-rate-update';
import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

type Props = {
  transaction: TTransaction;
};

export default function CashTransactionSummary({ transaction }: Props) {
  const triggerRef = useRef<TMutationCreatorResult>();

  const {
    isOpen: isConfirmRateOpen,
    onClose: onCloseConfirmRate,
    onOpen: onOpenConfirmRate,
  } = useDisclosure();

  const isNgTransaction = useMemo(() => {
    if (!transaction.beneficiary_type) return false;
    const parts = transaction.beneficiary_type.split('_');
    return parts[0]?.toLowerCase() === 'ng';
  }, [transaction.beneficiary_type]);

  const {
    createTransactionsParamsMutation,
    isLoading: isLoadingTrParams,
    data: transactionParams,
    isSuccess: isTrParamsSuccess,
  } = useCreateTransactionsParams({
    hideErrorMsg: true,
    hideSuccessMsg: true,
  });

  const [updatedAmount, setUpdatedAmount] = useState<
    (TTransactionParamsRes & { amount: number }) | null
  >(null);

  const formattedAmount = useMemo(() => {
    if (updatedAmount)
      return {
        amount: updatedAmount.amount,
        fee: updatedAmount.transactionParameters.fee,
      };

    return {
      amount:
        isNaN(+transaction.amount) || !isFinite(+transaction.amount)
          ? 0
          : +transaction.amount / 100,
      fee:
        isNaN(+transaction.fee) || !isFinite(+transaction.fee)
          ? 0
          : +transaction.fee / 100,
    };
  }, [transaction.amount, transaction.fee, updatedAmount]);

  const createParams = useCallback(() => {
    if (triggerRef.current) triggerRef.current.abort();

    triggerRef.current = createTransactionsParamsMutation({
      amount: formattedAmount.amount,
      beneficiary_country: 'NG',
    });
  }, [createTransactionsParamsMutation, formattedAmount.amount]);

  const { initiateSendMoneyMutation, data, isSuccess, isLoading } =
    useInitiateSendMoney({
      hideSuccessMsg: true,
    });

  const initiateSendMoney = () => {
    const payload: InitiateSendTransactionDTO = {
      amount: formattedAmount.amount,
      beneficiary_type: transaction.beneficiary_type ?? '',
      fx_quotation_id:
        transactionParams?.transactionParameters.fxQuotationId ?? '',
      beneficiary_account_number: transaction.beneficiary_account_number ?? '',
      beneficiary_name: transaction.beneficiary_name ?? '',
      beneficiary_email: transaction.beneficiary_email ?? '',
      narration: transaction.narration,
      purpose_of_transfer: transaction.purpose_of_transfer ?? '',
      relation_with_beneficiary: transaction.relation_with_beneficiary ?? '',
      sender_country: transaction.sender_country ?? '',
      source_of_funds: transaction.source_of_funds ?? '',
    };

    if (transaction.beneficiary_bank_code) {
      payload.bank_code = transaction.beneficiary_bank_code;
    } else if (transaction.beneficiary_wallet_name) {
      payload.wallet_name = transaction.beneficiary_wallet_name;
    }

    triggerRef.current = initiateSendMoneyMutation(payload);
  };

  const formattedAmountRef = useRef(formattedAmount);
  formattedAmountRef.current = formattedAmount;

  useEffect(() => {
    if (isNgTransaction && !updatedAmount) {
      createParams();
    }
  }, [createParams, isNgTransaction, updatedAmount]);

  useEffect(() => {
    if (!isLoadingTrParams && isTrParamsSuccess && transactionParams) {
      onOpenConfirmRate();
    }
  }, [
    isLoadingTrParams,
    isTrParamsSuccess,
    onOpenConfirmRate,
    transactionParams,
  ]);

  useEffect(() => {
    if (!isLoading && data && isSuccess && !isLoadingTrParams) {
      if (window) {
        window.location.replace(
          generatePaymentLink({
            amount: formattedAmountRef.current.amount,
            formattedAmount: (
              formattedAmountRef.current.amount + formattedAmountRef.current.fee
            ).toFixed(2),
            ref: data.reference,
          })
        );
      }
    }
  }, [data, isLoading, isLoadingTrParams, isSuccess]);

  const accountNumber = useMemo(() => {
    const acc = transaction.beneficiary_account_number ?? '';
    if (transaction.beneficiary_bank_code && transaction.beneficiary_type) {
      return `${acc} | ${snakeToFlat(transaction.beneficiary_type)}`;
    }

    if (transaction.beneficiary_wallet_name) {
      return `${acc} | ${snakeToFlat(transaction.beneficiary_wallet_name)}`;
    }

    return acc;
  }, [
    transaction.beneficiary_account_number,
    transaction.beneficiary_bank_code,
    transaction.beneficiary_type,
    transaction.beneficiary_wallet_name,
  ]);

  const recipientValue = useMemo(() => {
    if (!transactionParams) return;
    if (!formattedAmount.amount) return;

    const params = {
      fractionDigits: 2,
      currency: transactionParams.transactionParameters.destinationCurrency,
      locale:
        transactionParams.transactionParameters.destinationCurrency === 'USD'
          ? 'en-US'
          : 'en-NG',
    };

    return formatPrice(
      formattedAmount.amount *
        transactionParams.transactionParameters.exchangeRate,
      params
    );
  }, [formattedAmount.amount, transactionParams]);

  const {
    isOpen: isChangeAmountOpen,
    onClose: onCloseChangeAmount,
    onOpen: onOpenChangeAmount,
  } = useDisclosure();

  return (
    <>
      <ExchangeRateUpdate
        isOpen={isConfirmRateOpen}
        onClose={onCloseConfirmRate}
        transaction={transaction}
        params={transactionParams}
      />

      <ChangeAmount
        type="cash"
        isOpen={isChangeAmountOpen}
        onClose={onCloseChangeAmount}
        transaction={transaction}
        onComplete={setUpdatedAmount}
      />

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
            accountNumber={accountNumber}
            emailAddress={transaction.beneficiary_email ?? '-'}
          />

          <TransferDetails
            type="cash"
            recipientValue={recipientValue}
            amount={formattedAmount.amount}
            fee={formattedAmount.fee}
            recipientName={transaction.beneficiary_name ?? '-'}
            onChangeAmount={onOpenChangeAmount}
            isChangeAmountDisabled={isLoading || isLoadingTrParams}
          />

          <VStack w="full" spacing="4">
            <Button
              size="lg"
              fontSize="14px"
              w="full"
              variant={{ base: 'outline', lg: 'solid' }}
              onClick={initiateSendMoney}
              isLoading={isLoading || isLoadingTrParams}
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
                isDisabled={isLoading || isLoadingTrParams}
              >
                Back
              </Button>
            </RouterLink>
          </VStack>
        </VStack>
      </VStack>
    </>
  );
}
