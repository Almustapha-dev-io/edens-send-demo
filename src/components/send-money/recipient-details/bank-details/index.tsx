import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import CustomSelect from '@/components/ui/custom-select';
import { useSendMoneyContext } from '@/context/send-money';
import { useSendMoneySources } from '@/hooks/send-money';
import {
  setSendMoneyRecipientDetails,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import {
  RecipientBankSchema,
  TRecipientBank,
} from '@/lib/validations/send-money';

import BankAccountNumber from './bank-account-number';

export default function BankDetails() {
  const { recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendMoney
  );

  const dispatch = useAppDispatch();

  const getDefaultValues = (): Partial<TRecipientBank> => {
    if (!recipientDetails) return {};

    const { details, category } = recipientDetails;
    if (category !== 'bank') return {};

    return details;
  };

  const { banks } = useSendMoneySources();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TRecipientBank>({
    resolver: zodResolver(RecipientBankSchema),
    mode: 'all',
    defaultValues: getDefaultValues(),
  });

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const isVerified = useRef(false);

  const submitHandler: SubmitHandler<TRecipientBank> = () => {
    if (!isVerified.current)
      return toast.error('Enter a verified number!', {
        position: 'bottom-center',
      });

    onNextPage();
  };

  useEffect(() => {
    const subscription = watch((values) => {
      dispatch(
        setSendMoneyRecipientDetails({
          category: 'bank',
          details: values as TRecipientBank,
        })
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, watch]);

  return (
    <chakra.form
      w="full"
      display="flex"
      flexDirection="column"
      gap="6"
      onSubmit={handleSubmit(submitHandler)}
    >
      <Controller
        control={control}
        name="bank"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={!!fieldState.error}>
            <FormLabel>Choose Bank</FormLabel>
            <CustomSelect
              header="Choose Bank"
              value={field.value}
              onChange={field.onChange}
              options={banks}
              placeholder="Choose Bank"
            />
            <FormErrorMessage mt="2">
              {fieldState.error?.message}
            </FormErrorMessage>
          </FormControl>
        )}
      />

      <BankAccountNumber control={control} isVerified={isVerified} />

      <FormControl isInvalid={!!errors.narration}>
        <FormLabel>Narration</FormLabel>
        <Input
          size="lg"
          placeholder="eg. School Fees"
          {...register('narration')}
        />
        <FormErrorMessage>{errors.narration?.message}</FormErrorMessage>
      </FormControl>

      <VStack w="full" spacing="4" mt="3">
        <Button
          size="lg"
          fontSize="14px"
          w="full"
          variant={{ base: 'outline', lg: 'solid' }}
          type="submit"
        >
          Continue
        </Button>

        <Button
          size="lg"
          fontSize="14px"
          w="full"
          variant="ghost"
          onClick={onPrevioussPage}
        >
          Back
        </Button>
      </VStack>
    </chakra.form>
  );
}
