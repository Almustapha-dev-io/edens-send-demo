import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { PHONE_NUMBER_PATTERN } from '@/constants';
import { useRetryTransaction } from '@/hooks';

type Props = {
  onClose(): void;
  defaultValue: string;
  transaction: TTransaction;
};

export default function AirtimePhoneNumber({
  defaultValue,
  onClose,
  transaction,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [isTouched, setIsTouched] = useState(false);

  const isInvalid = useMemo(() => {
    if (!isTouched) return false;
    return !PHONE_NUMBER_PATTERN.test(value);
  }, [isTouched, value]);

  const { retryTransactionMutation, isLoading, isSuccess } =
    useRetryTransaction();

  const retryTransaction = () => {
    if (isLoading) return;

    retryTransactionMutation({
      transactionId: transaction.reference,
      beneficiary_phone_number: value,
    });
  };

  useEffect(() => {
    if (isSuccess && !isLoading) {
      onClose();
    }
  }, [isLoading, isSuccess, onClose]);

  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <FormLabel>Recipient Phone number</FormLabel>
        <Input
          size="lg"
          value={value}
          onChange={(e) => {
            setIsTouched(true);
            setValue(e.target.value);
          }}
        />
        <FormErrorMessage>Enter a valid phone number</FormErrorMessage>
      </FormControl>

      <VStack w="full" spacing="3" mt="3">
        <Button
          w="full"
          size="lg"
          fontSize="sm"
          isLoading={isLoading}
          onClick={retryTransaction}
        >
          Resend
        </Button>

        <Button
          w="full"
          size="lg"
          fontSize="sm"
          variant="ghost"
          onClick={onClose}
          isDisabled={isLoading}
        >
          Cancel Transfer
        </Button>
      </VStack>
    </>
  );
}
