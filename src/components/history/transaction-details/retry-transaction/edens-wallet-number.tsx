import {
  Avatar,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { If, Then } from 'react-if';
import { useDebounceValue } from 'usehooks-ts';

import { useRetryTransaction, useVerifyBeneficiary } from '@/hooks/send-money';
import { getServerErrorMessage } from '@/lib/errors';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

type Props = {
  country: string;
  walletType: string;
  defaultValue: string;
  transaction: TTransaction;
  onClose(): void;
};

export default function EdensWalletNumber({
  country,
  walletType,
  defaultValue,
  onClose,
  transaction,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [debouncedWalletNumber] = useDebounceValue(value, 200);

  const {
    verifyBeneficiaryMutation,
    isLoading: isVerifying,
    isError: isVerifyError,
    isSuccess: isVerified,
    data: verificationData,
    error: verificationError,
  } = useVerifyBeneficiary({ hideErrorMsg: true, hideSuccessMsg: true });

  const triggerRef = useRef<TMutationCreatorResult>();

  const verifyWalletNumber = useCallback(() => {
    if (!debouncedWalletNumber) return;
    if (triggerRef.current) triggerRef.current.abort();

    triggerRef.current = verifyBeneficiaryMutation({
      beneficiary_type: `${country}_WALLET`,
      wallet_name: walletType,
      account_number: debouncedWalletNumber,
    });
  }, [country, debouncedWalletNumber, verifyBeneficiaryMutation, walletType]);

  const getErrorMessage = () => {
    if (!isVerifying && isVerifyError)
      return getServerErrorMessage(verificationError);
    return 'An unexpected error occurred';
  };

  const { retryTransactionMutation, isLoading, isSuccess } =
    useRetryTransaction();

  const retryTransaction = () => {
    if (isLoading) return;

    retryTransactionMutation({
      transactionId: transaction.reference,
      beneficiary_account_number: value,
    });
  };

  useEffect(() => {
    verifyWalletNumber();
  }, [debouncedWalletNumber, verifyWalletNumber]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      onClose();
    }
  }, [isLoading, isSuccess, onClose]);

  return (
    <>
      <FormControl isInvalid={isVerifyError}>
        <FormLabel>Recipient Wallet Number</FormLabel>

        <InputGroup>
          <Input
            size="lg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <If condition={isVerifying}>
            <Then>
              <InputRightElement>
                <Center flexShrink="0" w="40px">
                  <Spinner w="20px" h="20px" />
                </Center>
              </InputRightElement>
            </Then>
          </If>
        </InputGroup>

        <FormErrorMessage>{getErrorMessage()}</FormErrorMessage>

        <If condition={!isVerifying && isVerified && !!verificationData}>
          <Then>
            <HStack
              mt="4"
              w="full"
              bg="#F4F4F4"
              rounded="8px"
              p="10px"
              spacing="10px"
            >
              <Avatar
                name={verificationData?.beneficiary_name}
                w="36px"
                h="36px"
              />
              <Text fontWeight="400" fontSize="14px">
                {verificationData?.beneficiary_name}
              </Text>
            </HStack>
          </Then>
        </If>
      </FormControl>

      <VStack w="full" spacing="3" mt="3">
        <Button
          w="full"
          size="lg"
          fontSize="sm"
          onClick={retryTransaction}
          isLoading={isLoading}
          isDisabled={isVerifying || isVerifyError}
        >
          Resend
        </Button>

        <Button
          w="full"
          size="lg"
          fontSize="sm"
          variant="ghost"
          onClick={onClose}
          isDisabled={isLoading}
        >
          Cancel Transfer
        </Button>
      </VStack>
    </>
  );
}
