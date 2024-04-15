import { Button, Heading, HStack, VStack } from '@chakra-ui/react';

import { formatPrice } from '@/lib/helpers';

import SummaryItem from './summary-item';

type Props = {
  recipientName?: string;
  fee: number;
  amount: number;
  recipientValue?: string;
  type: 'airtime' | 'cash';
  onChangeAmount?(): void;
  isChangeAmountDisabled?: boolean;
};

export default function TransferDetails({
  amount,
  fee,
  recipientName,
  recipientValue,
  isChangeAmountDisabled,
  onChangeAmount,
}: Props) {
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
              <span>{formatPrice(amount + fee, { fractionDigits: 2 })}</span>

              <Button
                size="sm"
                fontWeight="400"
                fontSize="13px"
                variant="ghost"
                bg="#E9F5F2"
                _hover={{
                  bg: 'primary.50',
                }}
                onClick={onChangeAmount}
                isDisabled={isChangeAmountDisabled}
              >
                Change
              </Button>
            </HStack>
          }
        />
        <SummaryItem
          label="Total Fees"
          content={formatPrice(fee, {
            fractionDigits: 2,
          })}
        />
        <SummaryItem
          label={`${recipientName ?? 'Recipient'} gets`}
          content={recipientValue ?? formatPrice(amount, { fractionDigits: 2 })}
        />
      </VStack>
    </VStack>
  );
}
