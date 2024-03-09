import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { formatPrice } from '@/lib/helpers';

type SummaryItemProps = {
  label: string;
  content: ReactNode;
};

function SummaryItem({ content, label }: SummaryItemProps) {
  return (
    <VStack
      className="summary__item"
      w="full"
      py="3"
      spacing="2px"
      align="flex-start"
      _notLast={{ borderBottom: '1px solid #D7DBE7' }}
    >
      <Heading as="h5" color="#979797" fontWeight="400" fontSize="14px">
        {label}
      </Heading>
      <Box w="full" color="#000" fontWeight="400" fontSize="14px">
        {content}
      </Box>
    </VStack>
  );
}

type Props = {
  transaction: TTransaction;
};

export default function Receipt({ transaction }: Props) {
  return (
    <VStack w="full" h="fit-content" spacing="8">
      <VStack w="full" spacing="6" align="flex-start">
        <Heading as="h3" fontWeight="700" fontSize="16px">
          Recipient Details
        </Heading>

        <VStack w="full" spacing="0">
          <SummaryItem label="Account Number" content="8562819410 | MoMo" />
          <SummaryItem label="Account Name" content=" Willaim Brown" />
          <SummaryItem label="Email Address" content="brandonw456@gmail.com" />
        </VStack>
      </VStack>

      <VStack w="full" spacing="6" align="flex-start">
        <Heading as="h3" fontWeight="700" fontSize="16px">
          Transfer Details
        </Heading>

        <VStack w="full" spacing="0">
          <SummaryItem
            label="You send exactly"
            content={formatPrice(transaction.amount, { fractionDigits: 2 })}
          />
          <SummaryItem label="Total fees" content="$0.00" />
          <SummaryItem
            label="Brandon Wesley gets"
            content={formatPrice(transaction.amount, { fractionDigits: 2 })}
          />
        </VStack>
      </VStack>

      <Button
        w="full"
        size="lg"
        fontSize="14px"
        variant={{ base: 'outline', lg: 'solid' }}
      >
        Download Receipt
      </Button>
    </VStack>
  );
}
