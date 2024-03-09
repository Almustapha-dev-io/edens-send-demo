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

type Props = {
  onClose(): void;
};

export default function VerifyAccount({ onClose }: Props) {
  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <Heading fontWeight="700" fontSize="20px">
        Verify that it&apos;s you
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Check your email address (john@doe.com) for a message with a
        verification code. Enter that code here.
      </Text>

      <FormControl>
        <FormLabel>OTP</FormLabel>
        <Input size="lg" placeholder="Enter Otp" />
      </FormControl>

      <HStack w="full" spacing="1">
        <Text fontSize="14px">Not received OTP?</Text>
        <Button variant="link" fontWeight="700" fontSize="14px">
          Resend
        </Button>
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
