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
  formatter?(value: string | number): string | number;
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
      formatter,
    },
    ref
  ) => {
    return (
      <HStack w="full" justify="space-between" align="center" spacing="4">
        <NumberInput
          w="full"
          flex="1"
          size="lg"
          variant="unstyled"
          precision={2}
          min={minValue}
          max={maxValue}
          isDisabled={isDisabled}
          value={value}
          onChange={onChange}
          format={formatter}
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
          </HStack>
        </NumberInput>

        {rightAddon}
      </HStack>
    );
  }
);

AmountInput.displayName = 'AmountInput';

export default AmountInput;
