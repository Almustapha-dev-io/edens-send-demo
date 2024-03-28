import { Heading, VStack } from '@chakra-ui/react';

import { formatPrice } from '@/lib/helpers';

import SummaryItem from './summary-item';

type Props = {
  recipientName?: string;
  fee: number;
  amount: number;
};

export default function TransferDetails({ amount, fee, recipientName }: Props) {
  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Transfer Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem
          label="You send exactly"
          content={formatPrice(amount + fee, { fractionDigits: 2 })}
        />
        <SummaryItem
          label="Total Fees"
          content={formatPrice(fee, {
            fractionDigits: 2,
          })}
        />
        <SummaryItem
          label={`${recipientName ?? 'Recipient'} gets`}
          content={formatPrice(amount, { fractionDigits: 2 })}
        />
      </VStack>
    </VStack>
  );
}
