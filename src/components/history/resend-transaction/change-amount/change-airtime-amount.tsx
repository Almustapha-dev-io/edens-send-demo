import {
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

type Props = {
  transaction: TTransaction;
  onComplete(amount: string): void;
};

export default function ChangeAirtimeAmount({
  onComplete,
  transaction,
}: Props) {
  const trAmount = useMemo(() => {
    const parsedAmount = +transaction.amount;
    if (isNaN(parsedAmount) || !isFinite(parsedAmount)) return 0;
    return parsedAmount / 100;
  }, [transaction.amount]);

  const [amt, setAmt] = useState<string>(trAmount.toString());

  const onContinue = () => {
    onComplete(amt);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Amount</FormLabel>
        <NumberInput
          clampValueOnBlur
          min={1}
          precision={2}
          size="lg"
          value={amt}
          onChange={setAmt}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Button
        mt="3"
        size="lg"
        fontSize="14px"
        w="full"
        variant={{ base: 'outline', lg: 'solid' }}
        onClick={onContinue}
        // isDisabled={watch('country') === 'NG'}
      >
        Continue
      </Button>
    </>
  );
}
