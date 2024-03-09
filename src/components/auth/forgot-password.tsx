import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

type Props = {
  onClose(): void;
};

export default function ForgotPassword({ onClose }: Props) {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <Heading fontWeight="700" fontSize="20px">
        Forgot Password
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Kindly enter your email here to reset your password.
      </Text>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input size="lg" type="email" />
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
