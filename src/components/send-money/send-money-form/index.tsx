import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import EqualsIcon from '@/components/icons/equals-icon';
import ExchangeIcon from '@/components/icons/exchange-icon';
import RemoveIcon from '@/components/icons/remove-icon';
import { CARD_SHADOW } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import {
  SendMoneyAmountSchema,
  TSendMoneyAmount,
} from '@/lib/validations/send-money';

import AmountInput from './amount-input';
import StatLabel from './stat-label';

export default function SendMoneyForm() {
  const { control, watch, handleSubmit } = useForm<TSendMoneyAmount>({
    resolver: zodResolver(SendMoneyAmountSchema),
    defaultValues: { amount: 0 },
    mode: 'all',
  });

  const { onNextPage } = useSendMoneyContext();

  const submitHandler: SubmitHandler<TSendMoneyAmount> = () => {
    onNextPage();
  };

  return (
    <chakra.form w="519px" maxW="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="6">
        <Heading
          as="h1"
          fontSize={{ base: '24px', md: '36px' }}
          fontWeight="700"
          textAlign="center"
        >
          Send money today
        </Heading>

        <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
          Pay any Edens360 or MTN momo wallet instantly
        </Heading>

        <VStack
          w="full"
          shadow={{ base: 'none', lg: CARD_SHADOW }}
          rounded={{ base: 'none', lg: '20px' }}
          bg={{ base: 'transparent', lg: '#fff' }}
          spacing="6"
          px={{ base: '0', lg: '30px' }}
          py={{ base: 1, md: 10 }}
        >
          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <FormControl
                w="full"
                rounded="10px"
                borderWidth="1px"
                borderStyle="solid"
                borderColor={fieldState.error ? 'red.500' : '#CDCED0'}
                p="15px"
                isInvalid={!!fieldState.error}
              >
                <FormLabel
                  color="#979797"
                  fontWeight="500"
                  fontSize="14px"
                  mb="0"
                >
                  You send
                </FormLabel>

                <AmountInput
                  maxValue={300}
                  minValue={0}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <VStack w="full" spacing="2">
            <StatLabel
              icon={<RemoveIcon />}
              label="Transfer fee"
              value="$0.00"
            />
            <StatLabel
              icon={<EqualsIcon />}
              label="Total amount to pay (Amount + Fee)"
              value="$0.00"
            />
            <StatLabel
              icon={<ExchangeIcon />}
              label="Exchange rate"
              value="$0.00"
            />
          </VStack>

          <FormControl
            w="full"
            rounded="10px"
            border="1px solid #CDCED0"
            p="15px"
          >
            <FormLabel color="#979797" fontWeight="500" fontSize="14px" mb="0">
              Beneficiary receives
            </FormLabel>

            <AmountInput minValue={0} value={watch('amount')} isDisabled />
          </FormControl>

          <Button
            mt="3"
            size="lg"
            fontSize="14px"
            w="full"
            variant={{ base: 'outline', lg: 'solid' }}
            type="submit"
          >
            Continue
          </Button>
        </VStack>
      </VStack>
    </chakra.form>
  );
}
