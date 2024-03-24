/* eslint-disable @typescript-eslint/indent */
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Spinner,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { codes as countries } from 'country-calling-code';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Case, If, Switch, Then } from 'react-if';
import { useDebounceValue } from 'usehooks-ts';

import CheckCircleIcon from '@/components/icons/check-circle-icon';
import CrossCircleIcon from '@/components/icons/cross-circle-icon';
import PhoneNumberInput from '@/components/ui/phone-number-input';
import { useRetryTransaction, useVerifyBeneficiary } from '@/hooks/send-money';
import { getServerErrorMessage } from '@/lib/errors';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';

const acceptedCountriesIso2 = new Set(['LR']);

type Props = {
  country: string;
  walletType: string;
  defaultValue: string;
  transaction: TTransaction;
  onClose(): void;
};

export default function MomoWalletPhone({
  country,
  defaultValue,
  onClose,
  transaction,
  walletType,
}: Props) {
  const [value, setValue] = useState(() => {
    const trCountry = countries.find((c) => c.isoCode2 === country);
    if (!trCountry) return '';
    const code = trCountry.countryCodes[0] ?? '';
    return `${code}${defaultValue}`;
  });
  const [debouncedPhone] = useDebounceValue(value, 200);

  const {
    verifyBeneficiaryMutation,
    isLoading: isVerifying,
    isError: isVerifyError,
    isSuccess: isVerified,
    data: verificationData,
    error: verificationError,
  } = useVerifyBeneficiary({ hideErrorMsg: true, hideSuccessMsg: true });

  const triggerRef = useRef<TMutationCreatorResult>();

  const verifyPhoneNumber = useCallback(() => {
    if (!debouncedPhone) return;
    if (triggerRef.current) triggerRef.current.abort();

    const number = debouncedPhone.slice(3);

    triggerRef.current = verifyBeneficiaryMutation({
      beneficiary_type: `${country}_WALLET`,
      wallet_name: walletType,
      account_number: number,
    });
  }, [country, debouncedPhone, verifyBeneficiaryMutation, walletType]);

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
    verifyPhoneNumber();
  }, [debouncedPhone, verifyPhoneNumber]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      onClose();
    }
  }, [isLoading, isSuccess, onClose]);

  return (
    <>
      <FormControl isInvalid={isVerifyError}>
        <FormLabel>Recipient MoMo/Phone number</FormLabel>
        <PhoneNumberInput
          options={countries
            .filter((c) => acceptedCountriesIso2.has(c.isoCode2.toUpperCase()))
            .map((c) => ({
              label: c.country,
              value: c.isoCode2,
            }))}
          country={country}
          size="lg"
          value={value}
          onValueChange={setValue}
          rightAddon={
            <Center flexShrink="0" w="40px">
              <Switch>
                <Case condition={isVerifying}>
                  <Spinner w="20px" h="20px" />
                </Case>
                <Case condition={!isVerifying}>
                  <If condition={isVerifyError}>
                    <Then>
                      <CrossCircleIcon width="16px" height="16px" />
                    </Then>
                  </If>
                  <If condition={isVerified}>
                    <Then>
                      <Tooltip label={verificationData?.message}>
                        <CheckCircleIcon width="16px" height="16px" />
                      </Tooltip>
                    </Then>
                  </If>
                </Case>
              </Switch>
            </Center>
          }
        />
        <FormErrorMessage>{getErrorMessage()}</FormErrorMessage>
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
