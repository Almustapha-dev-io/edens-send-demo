/* eslint-disable @typescript-eslint/indent */
import {
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { codes as countries } from 'country-calling-code';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import { Case, If, Switch, Then } from 'react-if';
import { useDebounceValue } from 'usehooks-ts';

import CheckCircleIcon from '@/components/icons/check-circle-icon';
import PhoneNumberInput from '@/components/ui/phone-number-input';
import { useVerifyBeneficiary } from '@/hooks/send-money';
import { useAppSelector } from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';
import { TRecipientWallet } from '@/lib/validations/send-money';

const acceptedCountriesIso2 = new Set(['LR']);

type Props = {
  control: Control<TRecipientWallet, unknown>;
  isVerified: MutableRefObject<boolean>;
};

export default function MomoWalletPhone({ control, isVerified }: Props) {
  const { country } = useAppSelector((s) => s.transactionParams.sendMoney);
  const { field, fieldState } = useController({
    control,
    name: 'phoneNumber',
  });
  const [debouncedPhone] = useDebounceValue(field.value, 200);

  const { verifyBeneficiaryMutation, isLoading, isError, isSuccess, data } =
    useVerifyBeneficiary({ hideErrorMsg: true, hideSuccessMsg: true });

  const triggerRef = useRef<TMutationCreatorResult>();

  const walletType = useWatch({ control, name: 'walletType' });

  const verifyPhoneNumber = useCallback(() => {
    if (fieldState.invalid || !debouncedPhone) return;
    if (triggerRef.current) triggerRef.current.abort();

    const number = debouncedPhone.slice(3);

    triggerRef.current = verifyBeneficiaryMutation({
      beneficiary_type: `${country}_WALLET`,
      wallet_name: walletType,
      account_number: number,
    });
  }, [
    country,
    debouncedPhone,
    fieldState.invalid,
    verifyBeneficiaryMutation,
    walletType,
  ]);

  useEffect(() => {
    verifyPhoneNumber();
  }, [debouncedPhone, verifyPhoneNumber]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      isVerified.current = true;
    }
  }, [isLoading, isSuccess, isVerified]);

  useEffect(() => {
    if (isError && !isLoading) {
      isVerified.current = false;
    }
  }, [isError, isLoading, isVerified]);

  return (
    <FormControl isInvalid={!!fieldState.error}>
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
        ref={field.ref}
        value={field.value}
        onValueChange={field.onChange}
        rightAddon={
          <Center flexShrink="0" w="40px">
            <Switch>
              <Case condition={isLoading}>
                <Spinner w="20px" h="20px" />
              </Case>
              <Case condition={!isLoading}>
                <If condition={isError}>
                  <Then>
                    <div>Err</div>
                  </Then>
                </If>
                <If condition={isSuccess}>
                  <Then>
                    <Tooltip label={data?.message}>
                      <CheckCircleIcon width="16px" height="16px" />
                    </Tooltip>
                  </Then>
                </If>
              </Case>
            </Switch>
          </Center>
        }
      />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}
