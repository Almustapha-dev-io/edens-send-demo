import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import PasswordInput from '../ui/password-input';
import RouterLink from '../ui/router-link';

type Props = {
  onClose(): void;
};

export default function CompleteSignup({ onClose }: Props) {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <VStack w="full" align="flex-start" spacing="0">
        <Heading fontWeight="700" fontSize="20px">
          Hello John,
        </Heading>
        <Text fontSize="20px">You do not have a Send by Eden360 account.</Text>
      </VStack>

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

      <Text w="full" fontWeight="400" fontSize="14px">
        Already have an account?{' '}
        <RouterLink to="?login=true" fontSize="14px" fontWeight="700">
          Log in Now
        </RouterLink>
      </Text>

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
