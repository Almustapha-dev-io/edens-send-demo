import { Heading, VStack } from '@chakra-ui/react';

import { useAppSelector } from '@/lib/redux';

import SummaryItem from './summary-item';

export default function RecipientDetails() {
  const { recipientDetails, recipientName, recipientEmail } = useAppSelector(
    (s) => s.transactionParams.sendMoney
  );

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

  const getEmail = () => {
    if (!recipientDetails) return '';
    if (recipientDetails.category === 'bank') {
      return 'Not applicable';
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'MTN_MOMO'
    ) {
      return recipientDetails.details.email;
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'EDENS360'
    ) {
      return recipientEmail;
    }

    return '';
  };

  const getAccountNumber = () => {
    if (!recipientDetails) return '';
    if (recipientDetails.category === 'bank') {
      return `${recipientDetails.details.accountNumber} | ${recipientDetails.details.bank.label}`;
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'MTN_MOMO'
    ) {
      return `${recipientDetails.details.phoneNumber} | MoMo`;
    }

    if (
      recipientDetails.category === 'wallet' &&
      recipientDetails.details.walletType === 'EDENS360'
    ) {
      return `${recipientDetails.details.walletNumber} | Edens360 Wallet`;
    }

    return '';
  };

  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Recipient Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem label="Account Number" content={getAccountNumber()} />
        <SummaryItem label="Account Name" content={getRecipientName()} />
        <SummaryItem label="Email Address" content={getEmail()} />
      </VStack>
    </VStack>
  );
}
