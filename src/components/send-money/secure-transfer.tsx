import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { codes } from 'country-calling-code';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { If, Then } from 'react-if';

import { CARD_SHADOW, RELATIONSHIPS } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import {
  setSecureTransferDetails,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import {
  SecureTransferSchema,
  TSecureTransferSchema,
} from '@/lib/validations/send-money';

import CustomSelect from '../ui/custom-select';

const countries: TCustomSelectItem<string>[] = codes.map((c) => ({
  label: c.country,
  value: c.country,
}));

export default function SecureTransfer() {
  const dispatch = useAppDispatch();
  const formDetails = useAppSelector(
    (s) => s.transactionParams.sendMoney.secureTransferDetails ?? {}
  );

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TSecureTransferSchema>({
    resolver: zodResolver(SecureTransferSchema),
    mode: 'all',
    defaultValues: {
      sourceOfFunds: '',
      relationship: '',
      transferPurpose: '',
      ...formDetails,
    },
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const submitHandler: SubmitHandler<TSecureTransferSchema> = () => {
    if (!isValid) return;

    onNextPage();
  };

  useEffect(() => {
    const subscription = watch((_values) => {
      dispatch(setSecureTransferDetails(_values as TSecureTransferSchema));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, watch]);

  return (
    <chakra.form w="519px" maxW="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="6">
        <Heading
          as="h1"
          fontSize={{ base: '24px', md: '36px' }}
          fontWeight="700"
          textAlign="center"
        >
          Secure your transfer
        </Heading>

        <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
          Just a few details about your transfer to ensure everything's set.
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
          <Controller
            control={control}
            name="senderCountry"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Sender Country</FormLabel>
                <CustomSelect
                  header="Choose Country"
                  value={field.value}
                  onChange={field.onChange}
                  options={countries}
                  placeholder="Choose Country"
                />
                <FormErrorMessage mt="2">
                  {fieldState.error?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />

          <FormControl isInvalid={!!errors.sourceOfFunds}>
            <FormLabel>Source of funds</FormLabel>
            <Select size="lg" {...register('sourceOfFunds')}>
              <option value="" disabled>
                Source of funds
              </option>
              <option value="salary">Salary</option>
              <option value="others">Others</option>
            </Select>
            <FormErrorMessage>{errors.sourceOfFunds?.message}</FormErrorMessage>
          </FormControl>

          <If condition={watch('sourceOfFunds') === 'others'}>
            <Then>
              <FormControl isInvalid={!!errors.otherSourceOfFunds}>
                <FormLabel>Specify source of funds</FormLabel>
                <Input size="lg" {...register('otherSourceOfFunds')} />
                <FormErrorMessage>
                  {errors.otherSourceOfFunds?.message}
                </FormErrorMessage>
              </FormControl>
            </Then>
          </If>

          <FormControl isInvalid={!!errors.transferPurpose}>
            <FormLabel>Purpose of transfer</FormLabel>
            <Select size="lg" {...register('transferPurpose')}>
              <option value="" disabled>
                Purpose of transfer
              </option>
              <option value="school fees">School fees</option>
              <option value="others">Others</option>
            </Select>
            <FormErrorMessage>
              {errors.transferPurpose?.message}
            </FormErrorMessage>
          </FormControl>

          <If condition={watch('transferPurpose') === 'others'}>
            <Then>
              <FormControl isInvalid={!!errors.otherTransferPurpose}>
                <FormLabel>Specify purpose</FormLabel>
                <Input size="lg" {...register('otherTransferPurpose')} />
                <FormErrorMessage>
                  {errors.otherTransferPurpose?.message}
                </FormErrorMessage>
              </FormControl>
            </Then>
          </If>

          <FormControl isInvalid={!!errors.relationship}>
            <FormLabel>Relationship with receiver</FormLabel>
            <Select size="lg" {...register('relationship')}>
              <option value="" disabled>
                Relationship with receiver
              </option>
              {RELATIONSHIPS.map((r) => (
                <option value={r.toLowerCase()}>{r}</option>
              ))}
              <option value="others">Others</option>
            </Select>
            <FormErrorMessage>{errors.relationship?.message}</FormErrorMessage>
          </FormControl>

          <If condition={watch('relationship') === 'others'}>
            <Then>
              <FormControl isInvalid={!!errors.otherRelationship}>
                <FormLabel>Specify relationship</FormLabel>
                <Input size="lg" {...register('otherRelationship')} />
                <FormErrorMessage>
                  {errors.otherRelationship?.message}
                </FormErrorMessage>
              </FormControl>
            </Then>
          </If>

          <VStack w="full" spacing="4" mt="3">
            <Button
              size="lg"
              fontSize="14px"
              w="full"
              variant={{ base: 'outline', lg: 'solid' }}
              type="submit"
              isDisabled={!isValid}
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
        </VStack>
      </VStack>
    </chakra.form>
  );
}
