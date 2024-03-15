import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { VERIFY_ACCOUNT } from '@/constants';
import { useWillUnmount } from '@/hooks';
import {
  clearError,
  endTask,
  signup,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { SignupSchema, TSignupForm } from '@/lib/validations/auth';

import PasswordInput from '../ui/password-input';
import RouterLink from '../ui/router-link';

type Props = {
  onClose(): void;
};

export default function CompleteSignup({ onClose }: Props) {
  const { sendAirtime, sendMoney } = useAppSelector((s) => s.transactionParams);
  const { error, status, signupSuccess } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupForm>({
    resolver: zodResolver(SignupSchema),
    mode: 'all',
  });

  const submitHandler: SubmitHandler<TSignupForm> = (values) => {
    if (isLoading) return;
    const payload = {
      email: '',
      first_name: '',
      last_name: '',
      password: values.password,
      phone_number: '',
    };

    if (sendAirtime.senderDetails) {
      payload.email = sendAirtime.senderDetails.email;
      payload.first_name = sendAirtime.senderDetails.firstName;
      payload.last_name = sendAirtime.senderDetails.lastName;
      payload.phone_number = sendAirtime.senderDetails.phoneNumber;
    }

    if (sendMoney.senderDetails) {
      payload.email = sendMoney.senderDetails.email;
      payload.first_name = sendMoney.senderDetails.firstName;
      payload.last_name = sendMoney.senderDetails.lastName;
      payload.phone_number = sendMoney.senderDetails.phoneNumber;
    }

    dispatch(signup(payload));
  };

  const userFirstName = useMemo(() => {
    if (sendAirtime.senderDetails) return sendAirtime.senderDetails.firstName;
    if (sendMoney.senderDetails) return sendMoney.senderDetails.firstName;
    return '';
  }, [sendAirtime.senderDetails, sendMoney.senderDetails]);

  useEffect(() => {
    if (signupSuccess) {
      navigate(VERIFY_ACCOUNT);
    }
  }, [navigate, signupSuccess]);

  useWillUnmount(() => {
    if (isLoading) dispatch(endTask());
    dispatch(clearError());
  });

  useEffect(() => {
    if (!sendAirtime.senderDetails && !sendMoney.senderDetails) {
      onClose();
    }
  }, [onClose, sendAirtime.senderDetails, sendMoney.senderDetails]);

  return (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="20px" align="flex-start">
        <VStack w="full" align="flex-start" spacing="0">
          <Heading fontWeight="700" fontSize="20px">
            Hello {userFirstName},
          </Heading>
          <Text fontSize="20px">
            You do not have a Send by Eden360 account.
          </Text>
        </VStack>

        <Text fontWeight="400" fontSize="14px">
          Create your password and start sending money to your loved ones.
        </Text>

        {!!error && (
          <Text color="red.500" fontSize="sm" fontWeight="700">
            {error}
          </Text>
        )}

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <PasswordInput size="lg" {...register('password')} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <PasswordInput size="lg" {...register('confirmPassword')} />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

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
