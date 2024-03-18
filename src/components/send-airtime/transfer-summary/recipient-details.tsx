import { Heading, VStack } from '@chakra-ui/react';

import { useAppSelector } from '@/lib/redux';

import SummaryItem from './summary-item';

export default function RecipientDetails() {
  const { recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendAirtime
  );

  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Recipient Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem
          label="Account Number"
          content={recipientDetails?.phoneNumber ?? '-'}
        />
        <SummaryItem label="Account Name" content="-" />
        <SummaryItem
          label="Email Address"
          content={recipientDetails?.email ?? '-'}
        />
      </VStack>
    </VStack>
  );
}
