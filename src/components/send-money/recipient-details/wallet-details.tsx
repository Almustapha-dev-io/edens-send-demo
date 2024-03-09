/* eslint-disable @typescript-eslint/indent */
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
import { codes as countries } from 'country-calling-code';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Case, Switch } from 'react-if';

import CustomSelect from '@/components/ui/custom-select';
import PhoneNumberInput from '@/components/ui/phone-number-input';
import { useSendMoneyContext } from '@/context/send-money';
import {
  RecipientWalletSchema,
  TRecipientWallet,
} from '@/lib/validations/send-money';

import AsyncValidatorInput from './async-validator-input';

const WALLET_TYPES: TCustomSelectItem<'mtnMomo' | 'edens'>[] = [
  {
    iconUrl: '/assets/icons/momo-logo.svg',
    label: 'Edens360 Wallet',
    value: 'edens',
  },
  {
    iconUrl: '/assets/icons/momo-logo.svg',
    label: 'MTN MoMo',
    value: 'mtnMomo',
  },
];

export default function WalletDetails() {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TRecipientWallet>({
    resolver: zodResolver(RecipientWalletSchema),
    mode: 'all',
    defaultValues: {
      walletType: 'mtnMomo',
    },
  });

  const [walletType, setWalletType] = useState<
    TCustomSelectItem<'mtnMomo' | 'edens'> | undefined
  >({
    iconUrl: '/assets/icons/momo-logo.svg',
    label: 'Edens360 Wallet',
    value: 'edens',
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const submitHandler: SubmitHandler<TRecipientWallet> = () => {
    onNextPage();
  };

  useEffect(() => {
    if (walletType) {
      setValue('walletType', walletType.value);
    }
  }, [setValue, walletType]);

  useEffect(() => {
    const subsciption = watch((_values, { name }) => {
      if (name === 'walletType') {
        setValue('email', '');
        setValue('name', '');
        setValue('narration', '');
        setValue('phoneNumber', '');
        setValue('walletNumber', '');
      }
    });

    return () => {
      subsciption.unsubscribe();
    };
  }, [setValue, watch]);

  return (
    <chakra.form
      w="full"
      display="flex"
      flexDirection="column"
      gap="6"
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormControl isInvalid={!!errors.walletType}>
        <FormLabel>Choose Wallet</FormLabel>
        <CustomSelect
          header="Choose Wallet"
          placeholder="Choose Wallet"
          value={walletType}
          onChange={setWalletType}
          options={WALLET_TYPES}
        />
      </FormControl>

      <Switch>
        <Case condition={watch('walletType') === 'edens'}>
          <FormControl isInvalid={'walletNumber' in errors}>
            <FormLabel>Recipient Wallet Number</FormLabel>
            <AsyncValidatorInput size="lg" {...register('walletNumber')} />
            {'walletNumber' in errors && (
              <FormErrorMessage>
                {errors.walletNumber?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Case>

        <Case condition={watch('walletType') === 'mtnMomo'}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Recipient MoMo/Phone number</FormLabel>
                <PhoneNumberInput
                  options={countries.map((country) => ({
                    label: country.country,
                    value: country.isoCode2,
                  }))}
                  country="LR"
                  size="lg"
                  ref={field.ref}
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <FormControl isInvalid={'email' in errors}>
            <FormLabel>Recipient Email address (optional)</FormLabel>
            <Input
              size="lg"
              type="email"
              placeholder="eg. john@smith.com"
              {...register('email')}
            />
            {'email' in errors && (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={'name' in errors}>
            <FormLabel>Recipient Name</FormLabel>
            <Input size="lg" placeholder="eg. John Doe" {...register('name')} />
            {'name' in errors && (
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Case>
      </Switch>

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
