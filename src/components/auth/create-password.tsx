import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import PasswordInput from '../ui/password-input';

type Props = {
  onClose(): void;
};

export default function CreatePassword({ onClose }: Props) {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <Heading fontWeight="700" fontSize="20px">
        Create New Password
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Create your password and start sending money to your loved ones.
      </Text>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <PasswordInput size="lg" />
      </FormControl>

      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <PasswordInput size="lg" />
      </FormControl>

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
