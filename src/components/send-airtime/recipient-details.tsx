import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import codes from 'country-calling-code';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CARD_SHADOW } from '@/constants';
import { useSendAirtimeContext } from '@/context/send-airtime';
import {
  RecipientDetailsSchema,
  TRecipientDetails,
} from '@/lib/validations/send-airtime';

import CustomSelect from '../ui/custom-select';
import PhoneNumberInput from '../ui/phone-number-input';

const countries: TCustomSelectItem<string>[] = codes.map((c) => ({
  label: c.country,
  value: c.country,
}));

const DUMMY_NETWORKS: TCustomSelectItem<string>[] = [
  { label: 'MTN Liberia', value: 'mtnLiberia' },
];

export default function RecipientDetails() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRecipientDetails>({
    resolver: zodResolver(RecipientDetailsSchema),
    mode: 'all',
  });

  const { onNextPage } = useSendAirtimeContext();

  const submitHandler: SubmitHandler<TRecipientDetails> = () => {
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
          Send airtime today
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
                  options={DUMMY_NETWORKS}
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
                <FormControl>Recipient Phone number</FormControl>
                <PhoneNumberInput
                  options={codes.map((country) => ({
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
