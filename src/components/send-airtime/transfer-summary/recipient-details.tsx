import { Heading, VStack } from '@chakra-ui/react';

import SummaryItem from './summary-item';

export default function RecipientDetails() {
  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Recipient Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem label="Account Number" content="8562819410 | MoMo" />
        <SummaryItem label="Account Name" content="William Brown" />
        <SummaryItem label="Email Address" content="brandonw456@gmail.com" />
      </VStack>
    </VStack>
  );
}
