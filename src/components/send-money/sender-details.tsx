import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { codes as countries } from 'country-calling-code';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CARD_SHADOW } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import {
  SenderDetailsSchema,
  TSenderDetails,
} from '@/lib/validations/send-money';

import PhoneNumberInput from '../ui/phone-number-input';

export default function SenderDetails() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TSenderDetails>({
    resolver: zodResolver(SenderDetailsSchema),
    mode: 'all',
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const submitHandler: SubmitHandler<TSenderDetails> = () => {
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
          We would need your details
        </Heading>

        <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
          Input your details in the input fields
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
            Sender details
          </Heading>

          <SimpleGrid w="full" spacing="6" columns={{ base: 1, md: 2 }}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                size="lg"
                placeholder="eg. John"
                {...register('firstName')}
              />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                size="lg"
                placeholder="eg. Doe"
                {...register('lastName')}
              />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={!!fieldState.error}>
                <FormLabel>Recipient MoMo/Phone number</FormLabel>
                <PhoneNumberInput
                  id="phoneNumber"
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

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              size="lg"
              placeholder="eg. john@smith.com"
              {...register('email')}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
        </VStack>
      </VStack>
    </chakra.form>
  );
}
