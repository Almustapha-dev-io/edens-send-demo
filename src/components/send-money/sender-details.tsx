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
import { useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CARD_SHADOW, COMPLETE_LOGIN, COMPLETE_SIGNUP } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import {
  useCheckEdensSendClient,
  useIsAuthenticated,
  useUser,
  useWillUnmount,
} from '@/hooks';
import { getServerErrorMessage, handleServerError } from '@/lib/errors';
import { setSenderDetails, useAppDispatch, useAppSelector } from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';
import {
  SenderDetailsSchema,
  TSenderDetails,
} from '@/lib/validations/send-money';

import PhoneNumberInput from '../ui/phone-number-input';

export default function SenderDetails() {
  const dispatch = useAppDispatch();
  const formDetails = useAppSelector(
    (s) => s.transactionParams.sendMoney.senderDetails
  );
  const user = useUser();
  const isAuth = useIsAuthenticated();
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<TSenderDetails>({
    resolver: zodResolver(SenderDetailsSchema),
    mode: 'all',
    defaultValues: {
      ...formDetails,
      email: isAuth ? user?.email ?? formDetails?.email : formDetails?.email,
    },
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();
  const { checkClientMutation, isLoading, isSuccess, error, isError } =
    useCheckEdensSendClient({
      hideSuccessMsg: true,
      hideErrorMsg: true,
    });

  const triggerRef = useRef<TMutationCreatorResult>();

  const submitHandler: SubmitHandler<TSenderDetails> = ({ email }) => {
    if (isLoading) {
      toast('Verifying your email...', { type: 'info' });
      return;
    }

    if (isAuth) {
      onNextPage();
      return;
    }

    triggerRef.current = checkClientMutation({
      email,
    });
  };

  useWillUnmount(() => {
    if (triggerRef.current) {
      triggerRef.current.abort();
    }
  });

  useEffect(() => {
    const subscription = watch((_values) => {
      dispatch(setSenderDetails(_values as TSenderDetails));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, watch]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      navigate(COMPLETE_LOGIN);
    }
  }, [isLoading, isSuccess, navigate]);

  useEffect(() => {
    if (isError && !isLoading) {
      const errorMsg = getServerErrorMessage(error);
      if (
        typeof errorMsg === 'string' &&
        errorMsg.toLowerCase() === 'sender not found'
      ) {
        navigate(COMPLETE_SIGNUP);
      } else {
        handleServerError(error);
      }
    }
  }, [isError, isLoading, navigate, error]);

  useEffect(() => {
    if (isAuth && user) {
      const opts = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };
      setValue('email', user.email, opts);
      setValue('firstName', user.first_name, opts);
      setValue('lastName', user.last_name, opts);
      setValue('phoneNumber', user.phone_number, opts);
    }
  }, [isAuth, setValue, user]);

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
            <FormControl isInvalid={!!errors.firstName} isDisabled={isAuth}>
              <FormLabel>First Name</FormLabel>
              <Input
                size="lg"
                placeholder="eg. John"
                {...register('firstName')}
              />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName} isDisabled={isAuth}>
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
              <FormControl isInvalid={!!fieldState.error} isDisabled={isAuth}>
                <FormLabel>Phone number</FormLabel>
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

          <FormControl isInvalid={!!errors.email} isDisabled={isAuth}>
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
              isLoading={isLoading}
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
