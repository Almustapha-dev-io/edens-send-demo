import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, useEffect, useMemo, useRef } from 'react';

import { useWillUnmount } from '@/hooks';
import {
  clearError,
  endTask,
  login,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

import PasswordInput from '../ui/password-input';
import RouterLink from '../ui/router-link';

type Props = {
  onClose(): void;
};

export default function CompleteLogin({ onClose }: Props) {
  const { sendAirtime, sendMoney } = useAppSelector((s) => s.transactionParams);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { error, status } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();

  const userFirstName = useMemo(() => {
    if (sendAirtime.senderDetails) return sendAirtime.senderDetails.firstName;
    if (sendMoney.senderDetails) return sendMoney.senderDetails.firstName;
    return '';
  }, [sendAirtime.senderDetails, sendMoney.senderDetails]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const email =
      sendAirtime.senderDetails?.email ?? sendMoney.senderDetails?.email;
    if (!passwordRef.current || !email) return;
    dispatch(
      login({
        email,
        password: passwordRef.current.value,
      })
    );
  };

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
    <chakra.form w="full" onSubmit={handleSubmit}>
      <VStack w="full" spacing="20px" align="flex-start">
        <VStack w="full" align="flex-start" spacing="0">
          <Heading fontWeight="700" fontSize="20px">
            Hello {userFirstName},
          </Heading>
          <Text fontSize="20px">
            You already have a Send by Edens360 account.
          </Text>
        </VStack>

        <Text fontWeight="400" fontSize="14px">
          Enter your password to continue
        </Text>

        {!!error && (
          <Text color="red.500" fontSize="sm" fontWeight="700">
            {error}
          </Text>
        )}

        <FormControl>
          <FormLabel>Password</FormLabel>
          <PasswordInput size="lg" ref={passwordRef} />
        </FormControl>

        <HStack w="full" justify="flex-end">
          <RouterLink to="?forgot-password=true" fontSize="14px">
            Forgot Password
          </RouterLink>
        </HStack>

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
