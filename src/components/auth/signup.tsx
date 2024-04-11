import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { codes } from 'country-calling-code';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from 'usehooks-ts';

import { SIGNUP_EMAIL_SESSION_STORAGE_KEY, VERIFY_ACCOUNT } from '@/constants';
import { useWillUnmount } from '@/hooks';
import {
  clearError,
  endTask,
  signup,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { NewSignupSchema, TNewSignupForm } from '@/lib/validations/auth';

import PasswordInput from '../ui/password-input';
import PhoneNumberInput from '../ui/phone-number-input';
import RouterLink from '../ui/router-link';

const countryCodesOptions = codes.map((c) => ({
  label: c.country,
  value: c.isoCode2,
}));

type Props = {
  onClose(): void;
};

export default function Signup({ onClose }: Props) {
  const { error, status, signupSuccess } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [, setSessionStorageEmail] = useSessionStorage(
    SIGNUP_EMAIL_SESSION_STORAGE_KEY,
    ''
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<TNewSignupForm>({
    resolver: zodResolver(NewSignupSchema),
    mode: 'all',
  });

  const submitHandler: SubmitHandler<TNewSignupForm> = (values) => {
    if (isLoading) return;

    dispatch(
      signup({
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
        phone_number: values.phone,
      })
    );
  };

  useWillUnmount(() => {
    if (isLoading) dispatch(endTask());
    dispatch(clearError());
  });

  useEffect(() => {
    if (signupSuccess) {
      setSessionStorageEmail(getValues('email'));
      navigate(VERIFY_ACCOUNT);
    }
  }, [getValues, navigate, setSessionStorageEmail, signupSuccess]);

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="20px" align="flex-start">
        <VStack w="full" align="flex-start" spacing="2">
          <Heading fontWeight="700" fontSize="20px">
            Sign up
          </Heading>
          <Text fontWeight="400" fontSize="14px">
            Create your account and start sending money to your loved ones.
          </Text>
        </VStack>

        {!!error && (
          <Text color="red.500" fontSize="sm" fontWeight="700">
            {error}
          </Text>
        )}

        <SimpleGrid w="full" columns={{ base: 1, md: 2 }} spacing="4">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel>First name</FormLabel>
            <Input size="lg" {...register('firstName')} />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel>Last name</FormLabel>
            <Input size="lg" {...register('lastName')} />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" size="lg" {...register('email')} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isInvalid={!!fieldState.error}>
                  <FormLabel>Phone number</FormLabel>
                  <PhoneNumberInput
                    size="lg"
                    options={countryCodesOptions}
                    country="LR"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            )}
          />

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <PasswordInput size="lg" {...register('password')} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <Text w="full" fontWeight="400" fontSize="14px">
          Already have an account?{' '}
          <RouterLink to="?login=true" fontSize="14px" fontWeight="700">
            Log in Now
          </RouterLink>
        </Text>

        <VStack w="full" spacing="3" mt="3">
          <Button
            w="full"
            size="lg"
            fontSize="sm"
            type="submit"
            isLoading={isLoading}
          >
            Continue
          </Button>

          <Button
            w="full"
            size="lg"
            fontSize="sm"
            variant="ghost"
            onClick={onClose}
            isDisabled={isLoading}
          >
            Close
          </Button>
        </VStack>
      </VStack>
    </chakra.form>
  );
}
