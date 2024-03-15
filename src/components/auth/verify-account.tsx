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
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';

import { useWillUnmount } from '@/hooks';
import {
  clearError,
  clearSignupSuccess,
  clearVerifyAccountStatus,
  endTask,
  useAppDispatch,
  useAppSelector,
  verifyAccount,
} from '@/lib/redux';

type Props = {
  onClose(): void;
};

export default function VerifyAccount({ onClose }: Props) {
  const { sendAirtime, sendMoney } = useAppSelector((s) => s.transactionParams);
  const { error, status, signupSuccess } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();

  const userEmail = useMemo(() => {
    if (sendAirtime.senderDetails) return sendAirtime.senderDetails.email;
    if (sendMoney.senderDetails) return sendMoney.senderDetails.email;
    return '';
  }, [sendAirtime.senderDetails, sendMoney.senderDetails]);

  const otpRef = useRef<HTMLInputElement>(null);

  const verifyHandler = () => {
    if (isLoading) return;
    if (!otpRef.current) return;

    const value = otpRef.current.value;
    if (!value) {
      toast('OTP is required!', { type: 'error', position: 'bottom-center' });
      return;
    }

    dispatch(verifyAccount(value));
  };

  useWillUnmount(() => {
    if (isLoading) dispatch(endTask());
    dispatch(clearError());
    dispatch(clearVerifyAccountStatus());
    dispatch(clearSignupSuccess());
  });

  useEffect(() => {
    if (!signupSuccess) onClose();
  }, [onClose, signupSuccess]);

  return (
    <VStack w="full" spacing="20px" align="flex-start">
      <Heading fontWeight="700" fontSize="20px">
        Verify that it&apos;s you
      </Heading>

      <Text fontWeight="400" fontSize="14px">
        Check your email address ({userEmail}) for a message with a verification
        code. Enter that code here.
      </Text>

      {!!error && (
        <Text color="red.500" fontSize="sm" fontWeight="700">
          {error}
        </Text>
      )}

      <FormControl>
        <FormLabel>OTP</FormLabel>
        <Input size="lg" placeholder="Enter Otp" ref={otpRef} />
      </FormControl>

      <HStack w="full" spacing="1">
        <Text fontSize="14px">Not received OTP?</Text>
        <Button variant="link" fontWeight="700" fontSize="14px">
          Resend
        </Button>
      </HStack>

      <VStack w="full" spacing="3" mt="3">
        <Button
          w="full"
          size="lg"
          fontSize="sm"
          isLoading={isLoading}
          onClick={verifyHandler}
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
  );
}
