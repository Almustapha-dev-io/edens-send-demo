import { Button, Heading, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useRef } from 'react';

import RouterLink from '@/components/ui/router-link';
import { CARD_SHADOW } from '@/constants';
import { useInitiateSendMoney } from '@/hooks';
import { formatPrice, generatePaymentLink, snakeToFlat } from '@/lib/helpers';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

import RecipientDetails from './recipient-details';
import TransferDetails from './transfer-details';

type Props = {
  transaction: TTransaction;
};

export default function CashTransactionSummary({ transaction }: Props) {
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

  const { initiateSendMoneyMutation, data, isSuccess, isLoading } =
    useInitiateSendMoney({
      hideSuccessMsg: true,
    });

  const triggerRef = useRef<TMutationCreatorResult>();
  const initiateSendMoney = () => {
    const payload: InitiateSendTransactionDTO = {
      amount: formattedAmount.amount,
      beneficiary_type: transaction.beneficiary_type ?? '',
      fx_quotation_id: '',
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
    if (!isLoading && data && isSuccess) {
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
  }, [data, isLoading, isSuccess]);

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
          accountNumber={accountNumber}
          emailAddress={transaction.beneficiary_email ?? '-'}
        />
        <TransferDetails
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
            onClick={initiateSendMoney}
            isLoading={isLoading}
          >
            Pay{' '}
            {formatPrice(formattedAmount.amount, {
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
