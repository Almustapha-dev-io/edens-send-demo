import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, useMemo, useRef } from 'react';

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

export default function Login({ onClose }: Props) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { error, status } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current || !passwordRef.current) return;
    dispatch(
      login({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
    );
  };

  useWillUnmount(() => {
    if (isLoading) dispatch(endTask());
    dispatch(clearError());
  });

  return (
    <chakra.form w="full" onSubmit={handleSubmit}>
      <VStack w="full" spacing="20px" align="flex-start">
        <Heading fontWeight="700" fontSize="20px">
          Login
        </Heading>

        <Text fontWeight="400" fontSize="14px">
          Enter your email and password to continue.
        </Text>

        {!!error && (
          <Text color="red.500" fontSize="sm" fontWeight="700">
            {error}
          </Text>
        )}

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input size="lg" type="email" ref={emailRef} />
        </FormControl>

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
