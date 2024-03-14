import {
  Avatar,
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
} from '@chakra-ui/react';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import { If, Then } from 'react-if';
import { useDebounceValue } from 'usehooks-ts';

import { useVerifyBeneficiary } from '@/hooks/send-money';
import { getServerErrorMessage } from '@/lib/errors';
import { setRecipientName, useAppDispatch, useAppSelector } from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';
import { TRecipientBank } from '@/lib/validations/send-money';

type Props = {
  control: Control<TRecipientBank, unknown>;
  isVerified: MutableRefObject<boolean>;
};

export default function BankAccountNumber({ control, isVerified }: Props) {
  const dispatch = useAppDispatch();
  const { country } = useAppSelector((s) => s.transactionParams.sendMoney);

  const { field, fieldState } = useController({
    control,
    name: 'accountNumber',
  });

  const [debouncedAccountNumber] = useDebounceValue(field.value, 200);

  const {
    verifyBeneficiaryMutation,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useVerifyBeneficiary({ hideErrorMsg: true, hideSuccessMsg: true });

  const triggerRef = useRef<TMutationCreatorResult>();

  const bank = useWatch({ control, name: 'bank' });

  const verifyAccountNumber = useCallback(() => {
    if (fieldState.invalid || !debouncedAccountNumber) return;
    if (triggerRef.current) triggerRef.current.abort();

    triggerRef.current = verifyBeneficiaryMutation({
      beneficiary_type: `${country}_BANK`,
      bank_code: bank.value,
      account_number: debouncedAccountNumber,
    });
  }, [
    country,
    debouncedAccountNumber,
    fieldState.invalid,
    verifyBeneficiaryMutation,
    bank,
  ]);

  const getErrorMessage = () => {
    if (fieldState.error) return fieldState.error.message;
    if (!isLoading && isError) return getServerErrorMessage(error);

    return 'An unexpected error occurred';
  };

  useEffect(() => {
    verifyAccountNumber();
  }, [debouncedAccountNumber, verifyAccountNumber]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      isVerified.current = true;
      dispatch(setRecipientName(data?.beneficiary_name));
    }
  }, [data?.beneficiary_name, dispatch, isLoading, isSuccess, isVerified]);

  useEffect(() => {
    if (isError && !isLoading) {
      isVerified.current = false;
      dispatch(setRecipientName(''));
    }
  }, [dispatch, isError, isLoading, isVerified]);

  return (
    <FormControl isInvalid={!!fieldState.error || isError}>
      <FormLabel>Recipient Account Number</FormLabel>

      <InputGroup>
        <Input size="lg" {...field} />
        <If condition={isLoading}>
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

      <If condition={!isLoading && isSuccess && !!data}>
        <Then>
          <HStack
            mt="4"
            w="full"
            bg="#F4F4F4"
            rounded="8px"
            p="10px"
            spacing="10px"
          >
            <Avatar name={data?.beneficiary_name} w="36px" h="36px" />
            <Text fontWeight="400" fontSize="14px">
              {data?.beneficiary_name}
            </Text>
          </HStack>
        </Then>
      </If>
    </FormControl>
  );
}
