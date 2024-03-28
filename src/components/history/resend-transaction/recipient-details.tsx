import { Heading, VStack } from '@chakra-ui/react';

import SummaryItem from './summary-item';

type Props = {
  accountNumber: string;
  accountName: string;
  emailAddress?: string;
};

export default function RecipientDetails({
  accountName,
  accountNumber,
  emailAddress,
}: Props) {
  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Recipient Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem label="Account Number" content={accountNumber} />
        <SummaryItem label="Account Name" content={accountName} />
        <SummaryItem label="Email Address" content={emailAddress ?? '-'} />
      </VStack>
    </VStack>
  );
}
