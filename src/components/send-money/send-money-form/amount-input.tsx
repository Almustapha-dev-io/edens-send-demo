import { HStack, NumberInput, NumberInputField, Text } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';

type Props = {
  currency?: string;
  value?: string | number;
  isDisabled?: boolean;
  maxValue?: number;
  minValue?: number;
  onChange?(value: string | number): void;
  rightAddon?: ReactNode;
};

const AmountInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      onChange,
      value,
      isDisabled,
      maxValue,
      minValue,
      rightAddon,
      currency = '$',
    },
    ref
  ) => {
    return (
      <NumberInput
        size="lg"
        variant="unstyled"
        clampValueOnBlur
        precision={2}
        min={minValue}
        max={maxValue}
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
      >
        <HStack w="full" justify="flex-start" spacing="1">
          <Text fontWeight="700" fontSize="20px" color="#C4C4C4">
            {currency}
          </Text>
          <NumberInputField
            fontWeight="700"
            fontSize="24px"
            flex="1"
            _disabled={{ color: '#000' }}
            ref={ref}
          />
          {rightAddon}
        </HStack>
      </NumberInput>
    );
  }
);

AmountInput.displayName = 'AmountInput';

export default AmountInput;
