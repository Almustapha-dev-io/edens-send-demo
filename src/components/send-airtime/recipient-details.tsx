/* eslint-disable @typescript-eslint/indent */
import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { codes } from 'country-calling-code';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { If, Then } from 'react-if';

import { CARD_SHADOW, FLAG_URL } from '@/constants';
import { useSendAirtimeContext } from '@/context/send-airtime';
import { useGetUserLocation, useOnMount } from '@/hooks';
import {
  setSendAirtimeRecipientDetails,
  useAppDispatch,
  useAppSelector,
  useGetAirtimeBillProvidersQuery,
} from '@/lib/redux';
import {
  RecipientDetailsSchema,
  TRecipientDetails,
} from '@/lib/validations/send-airtime';

import CustomSelect from '../ui/custom-select';
import ErrorPlaceholder from '../ui/error-placeholder';
import PhoneNumberInput from '../ui/phone-number-input';

export default function RecipientDetails() {
  const { recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendAirtime
  );
  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TRecipientDetails>({
    resolver: zodResolver(RecipientDetailsSchema),
    mode: 'all',
    defaultValues: recipientDetails ?? {},
  });

  const {
    isFetching,
    isError,
    data: countriesRes,

    refetch,
  } = useGetAirtimeBillProvidersQuery();

  const { onNextPage } = useSendAirtimeContext();
  const [networks, setNetworks] = useState<
    TCustomSelectItem<TAirtimeBillProvider>[]
  >([]);

  const submitHandler: SubmitHandler<TRecipientDetails> = () => {
    onNextPage();
  };

  const countries = useMemo<TCustomSelectItem<TAirtimeCountry>[]>(() => {
    if (!countriesRes) return [];
    return countriesRes.billsproviders.map((b) => ({
      label: b.name,
      value: b,
    }));
  }, [countriesRes]);

  const { isSuccess, data } = useGetUserLocation();

  useOnMount(() => {
    if (recipientDetails) {
      setValue('country', recipientDetails.country, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  });

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name === 'country' && values.country) {
        const providers = values.country.value?.billproviders?.map((b) => ({
          label: b?.name ?? '',
          value: b as TAirtimeBillProvider,
        })) as TCustomSelectItem<TAirtimeBillProvider>[];

        setNetworks((prev) => providers ?? prev);
      }

      dispatch(setSendAirtimeRecipientDetails(values as TRecipientDetails));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, watch]);

  if (isError) {
    return (
      <ErrorPlaceholder
        w="519px"
        maxW="full"
        label="Failed to get products"
        retryHandler={refetch}
        isLoading={isFetching}
        bg="#fff"
        px="4"
        py="10"
        rounded="12px"
      />
    );
  }

  return (
    <chakra.form w="519px" maxW="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="6">
        <Heading
          as="h1"
          fontSize={{ base: '24px', md: '36px' }}
          fontWeight="700"
          textAlign="center"
        >
          Send Airtime Globally
          <If condition={isSuccess && !!data}>
            <Then>
              <br />
              <chakra.span color="#92CCBF">
                from {data?.country_name ?? ''}
                <Image
                  ml="2"
                  src={FLAG_URL(data?.country_code.toLowerCase() ?? '')}
                  w="32px"
                  h={{ base: '20px', md: '24px' }}
                  display="inline"
                />
              </chakra.span>
            </Then>
          </If>
        </Heading>

        <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
          Send airtime to family and friends globally
        </Heading>

        <VStack
          align="flex-start"
          w="full"
          shadow={{ base: 'none', lg: CARD_SHADOW }}
          rounded={{ base: 'none', lg: '20px' }}
          bg={{ base: 'transparent', lg: '#fff' }}
          spacing="6"
          px={{ base: 0, lg: '30px' }}
          py={{ base: 2, md: 10 }}
        >
          <Heading fontWeight="700" fontSize="16px">
            Recipient details
          </Heading>

          <Controller
            control={control}
            name="country"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Choose country</FormLabel>
                <CustomSelect
                  header="Choose country"
                  value={field.value}
                  onChange={field.onChange}
                  options={countries}
                  placeholder="Choose country"
                  isLoading={isFetching}
                />
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="network"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Choose network</FormLabel>
                <CustomSelect
                  header="Choose network"
                  value={field.value}
                  onChange={field.onChange}
                  options={networks}
                  placeholder="Choose network"
                />
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Recipient Phone number</FormLabel>
                <PhoneNumberInput
                  options={codes
                    .filter(
                      (c) =>
                        c.isoCode2 === watch('country')?.value?.country_code
                    )
                    .map((country) => ({
                      label: country.country,
                      value: country.isoCode2,
                    }))}
                  country={watch('country')?.value?.country_code}
                  size="lg"
                  ref={field.ref}
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Recipient Email address (optional)</FormLabel>
            <Input size="lg" type="email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
