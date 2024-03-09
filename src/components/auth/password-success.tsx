import { Button, Heading, Text, VStack } from '@chakra-ui/react';

import CheckCircleIcon from '../icons/check-circle-icon';
import RouterLink from '../ui/router-link';

export default function PasswordSuccess() {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <CheckCircleIcon />

      <Heading fontWeight="700" fontSize="20px">
        Password Changed Successfully
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Your password has been changed, click continue to login
      </Text>

      <RouterLink to="?login=true" w="full" mt="2">
        <Button w="full" size="lg" fontSize="sm" pointerEvents="none">
          Continue
        </Button>
      </RouterLink>
    </VStack>
  );
}
