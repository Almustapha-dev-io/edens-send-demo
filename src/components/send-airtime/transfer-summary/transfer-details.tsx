import { Button, Heading, HStack, VStack } from '@chakra-ui/react';

import SummaryItem from './summary-item';

export default function TransferDetails() {
  return (
    <VStack w="full" align="flex-start">
      <Heading fontWeight="700" fontSize="16px">
        Transfer Details
      </Heading>

      <VStack w="full" spacing="0">
        <SummaryItem
          label="You send exactly"
          content={
            <HStack w="full" justify="space-between">
              <span>2,000.00</span>

              <Button
                size="sm"
                fontWeight="400"
                fontSize="13px"
                variant="ghost"
                bg="#E9F5F2"
                _hover={{
                  bg: 'primary.50',
                }}
              >
                Change
              </Button>
            </HStack>
          }
        />
        <SummaryItem label="Total Fees" content="0.00" />
        <SummaryItem label="Brandon Wesley gets" content="2,000.00" />
      </VStack>
    </VStack>
  );
}
