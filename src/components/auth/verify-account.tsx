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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Case, Default, Switch } from 'react-if';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSessionStorage } from 'usehooks-ts';

import { SIGNUP, SIGNUP_EMAIL_SESSION_STORAGE_KEY } from '@/constants';
import { useResendAccountVerification, useWillUnmount } from '@/hooks';
import {
  clearError,
  clearSignupSuccess,
  clearVerifyAccountStatus,
  endTask,
  useAppDispatch,
  useAppSelector,
  verifyAccount,
} from '@/lib/redux';

const RESEND_DELAY = 30; // 30 seconds

function ResendTokenButton({ email }: { email: string }) {
  const navigate = useNavigate();

  const [duration, setDuration] = useState(RESEND_DELAY);

  const { resendAccountVerificationMutation, isLoading, isSuccess, reset } =
    useResendAccountVerification();

  const clickHandler = () => {
    if (isLoading) return;
    resendAccountVerificationMutation(email);
  };

  useEffect(() => {
    let timeout: number;

    if (isSuccess && !isLoading) {
      timeout = setTimeout(() => {
        reset();
        setDuration(RESEND_DELAY);
      }, RESEND_DELAY * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, isSuccess, reset]);

  useEffect(() => {
    let interval: number;
    if (isSuccess && !isLoading) {
      interval = setInterval(() => {
        setDuration((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1_000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (!email) {
      navigate(SIGNUP);
    }
  }, [navigate, email]);

  return (
    <Button
      isDisabled={isSuccess || isLoading}
      _disabled={{ opacity: 1, cursor: 'not-allowed' }}
      variant="link"
      fontWeight="700"
      fontSize="14px"
      onClick={clickHandler}
    >
      <Switch>
        <Case condition={isLoading}>Sending...</Case>
        <Case condition={isSuccess && !isLoading}>
          Retry in {duration} seconds
        </Case>
        <Default>Resend</Default>
      </Switch>
    </Button>
  );
}

type Props = {
  onClose(): void;
};

export default function VerifyAccount({ onClose }: Props) {
  const { sendAirtime, sendMoney } = useAppSelector((s) => s.transactionParams);
  const { error, status, signupSuccess } = useAppSelector((s) => s.auth);
  const isLoading = useMemo(() => status === 'pending', [status]);
  const dispatch = useAppDispatch();
  const [storageEmail, setStorageEmail] = useSessionStorage(
    SIGNUP_EMAIL_SESSION_STORAGE_KEY,
    ''
  );

  const userEmail = useMemo(() => {
    if (storageEmail) return storageEmail;
    if (sendAirtime.senderDetails) return sendAirtime.senderDetails.email;
    if (sendMoney.senderDetails) return sendMoney.senderDetails.email;
    return '';
  }, [sendAirtime.senderDetails, sendMoney.senderDetails, storageEmail]);

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
    if (storageEmail) {
      setStorageEmail('');
    }
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
        <ResendTokenButton email={userEmail} />
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
