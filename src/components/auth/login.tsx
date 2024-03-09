import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import PasswordInput from '../ui/password-input';
import RouterLink from '../ui/router-link';

type Props = {
  onClose(): void;
};

export default function Login({ onClose }: Props) {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <Heading fontWeight="700" fontSize="20px">
        Login
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Enter your email and password to continue.
      </Text>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input size="lg" type="email" />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <PasswordInput size="lg" />
      </FormControl>
      <HStack w="full" justify="flex-end">
        <RouterLink to="?forgot-password=true" fontSize="14px">
          Forgot Password
        </RouterLink>
      </HStack>

      <VStack w="full" spacing="3" mt="3">
        <Button w="full" size="lg" fontSize="sm">
          Continue
        </Button>

        <Button
          w="full"
          size="lg"
          fontSize="sm"
          variant="ghost"
          onClick={onClose}
        >
          Close
        </Button>
      </VStack>
    </VStack>
  );
}
