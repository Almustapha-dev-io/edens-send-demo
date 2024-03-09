import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import CustomSelect from '@/components/ui/custom-select';
import { useSendMoneyContext } from '@/context/send-money';
import {
  RecipientBankSchema,
  TRecipientBank,
} from '@/lib/validations/send-money';

import AsyncValidatorInput from './async-validator-input';

const DUMMY_BANKS: TCustomSelectItem<string>[] = [
  { label: 'GT Bank', iconUrl: '/assets/icons/gtb-logo.svg', value: 'gtb' },
  {
    label: 'Access Bank',
    iconUrl: '/assets/icons/access-logo.svg',
    value: 'access',
  },
  {
    label: 'UBA',
    iconUrl: '/assets/icons/uba-logo.svg',
    value: 'uba',
  },
];

export default function BankDetails() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRecipientBank>({
    resolver: zodResolver(RecipientBankSchema),
    mode: 'all',
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const submitHandler: SubmitHandler<TRecipientBank> = () => {
    onNextPage();
  };

  return (
    <chakra.form
      w="full"
      display="flex"
      flexDirection="column"
      gap="6"
      onSubmit={handleSubmit(submitHandler)}
    >
      <Controller
        control={control}
        name="bank"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={!!fieldState.error}>
            <FormLabel>Choose Bank</FormLabel>
            <CustomSelect
              header="Choose Bank"
              value={field.value}
              onChange={field.onChange}
              options={DUMMY_BANKS}
              placeholder="Choose Bank"
            />
            <FormErrorMessage mt="2">
              {fieldState.error?.message}
            </FormErrorMessage>
          </FormControl>
        )}
      />

      <FormControl isInvalid={!!errors.accountNumber}>
        <FormLabel>Recipient Account Number</FormLabel>
        <AsyncValidatorInput size="lg" {...register('accountNumber')} />
        <FormErrorMessage>{errors.accountNumber?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.narration}>
        <FormLabel>Narration</FormLabel>
        <Input
          size="lg"
          placeholder="eg. School Fees"
          {...register('narration')}
        />
        <FormErrorMessage>{errors.narration?.message}</FormErrorMessage>
      </FormControl>

      <VStack w="full" spacing="4" mt="3">
        <Button
          size="lg"
          fontSize="14px"
          w="full"
          variant={{ base: 'outline', lg: 'solid' }}
          type="submit"
        >
          Continue
        </Button>

        <Button
          size="lg"
          fontSize="14px"
          w="full"
          variant="ghost"
          onClick={onPrevioussPage}
        >
          Back
        </Button>
      </VStack>
    </chakra.form>
  );
}
