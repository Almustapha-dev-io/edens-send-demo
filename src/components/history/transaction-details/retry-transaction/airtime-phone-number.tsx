import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import { codes } from 'country-calling-code';
import { parseNumber } from 'libphonenumber-js';
import { useEffect, useMemo, useState } from 'react';

import PhoneNumberInput from '@/components/ui/phone-number-input';
import { PHONE_NUMBER_PATTERN } from '@/constants';
import { useOnMount, useRetryTransaction } from '@/hooks';

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
  const [country, setCountry] = useState('');
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
      transactionId: transaction.id,
      beneficiary_phone_number: value,
    });
  };

  useOnMount(() => {
    const parsedNumber = parseNumber(`+${defaultValue}`);
    if (parsedNumber && 'country' in parsedNumber) {
      setCountry(parsedNumber.country);
    }
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      onClose();
    }
  }, [isLoading, isSuccess, onClose]);

  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <FormLabel>Recipient Phone number</FormLabel>
        <PhoneNumberInput
          options={codes
            .filter((c) => c.isoCode2 === country)
            .map((c) => ({
              label: c.country,
              value: c.isoCode2,
            }))}
          country={country}
          size="lg"
          value={value}
          onValueChange={(v) => {
            setIsTouched(true);
            setValue(v);
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
