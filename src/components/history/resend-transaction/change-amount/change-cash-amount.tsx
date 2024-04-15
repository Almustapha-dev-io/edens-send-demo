import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDebounceValue } from 'usehooks-ts';

import EqualsIcon from '@/components/icons/equals-icon';
import ExchangeIcon from '@/components/icons/exchange-icon';
import LrFlagIcon from '@/components/icons/lr-flag-icon';
import NgFlagIcon from '@/components/icons/ng-flag-icon';
import PlusIcon from '@/components/icons/plus-icon';
import AmountInput from '@/components/send-money/send-money-form/amount-input';
import StatLabel from '@/components/send-money/send-money-form/stat-label';
import { useCreateTransactionsParams } from '@/hooks';
import { formatNumber, formatPrice } from '@/lib/helpers';
import { TTransactionParamsRes } from '@/lib/redux/slices/api-slice/builders';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';
import {
  SendMoneyAmountSchema,
  TSendMoneyAmount,
} from '@/lib/validations/send-money';

const COUNTRIES = [
  {
    label: 'LIB',
    value: 'LR',
  },
  {
    label: 'NGN',
    value: 'NG',
  },
];
const COUNTRIES_FLAGS: Record<string, ReactNode> = {
  LR: <LrFlagIcon width="24px" height="24px" style={{ flexShrink: 0 }} />,
  NG: <NgFlagIcon width="24px" height="24px" style={{ flexShrink: 0 }} />,
};

type Props = {
  transaction: TTransaction;
  onComplete(value: TTransactionParamsRes & { amount: number }): void;
};

export default function ChangeCashAmount({ transaction, onComplete }: Props) {
  const recipientCountry = useMemo(() => {
    if (!transaction.beneficiary_type) return '';
    const parts = transaction.beneficiary_type.split('_');
    return parts[0] ?? '';
  }, [transaction.beneficiary_type]);

  const trAmount = useMemo(() => {
    const parsedAmount = +transaction.amount;
    if (isNaN(parsedAmount) || !isFinite(parsedAmount)) return 0;
    return parsedAmount / 100;
  }, [transaction.amount]);

  const {
    control,
    watch,
    getValues,
    register,
    formState: { isValid },
  } = useForm<TSendMoneyAmount>({
    resolver: zodResolver(SendMoneyAmountSchema),
    defaultValues: {
      amount: trAmount,
      country: recipientCountry,
    },
    mode: 'all',
  });

  const [debouncedAmount] = useDebounceValue(watch('amount'), 250);

  const {
    createTransactionsParamsMutation,
    isLoading,
    data: transactionParams,
    reset: resetRequest,
  } = useCreateTransactionsParams({
    hideErrorMsg: true,
    hideSuccessMsg: true,
  });

  const triggerRef = useRef<TMutationCreatorResult>();

  const createParams = useCallback(
    (amt: number, ctry: string) => {
      if (!isValid || !amt) return;
      if (triggerRef.current) triggerRef.current.abort();
      const amount = isFinite(amt) ? amt : 0;

      triggerRef.current = createTransactionsParamsMutation({
        amount,
        beneficiary_country: ctry,
      });
    },
    [createTransactionsParamsMutation, isValid]
  );

  const onContinue = () => {
    if (!transactionParams || !debouncedAmount) {
      toast('Enter your transaction details', {
        type: 'warning',
        position: 'bottom-center',
      });
      return;
    }

    const values = getValues();
    if (transactionParams) {
      onComplete({
        transactionParameters: transactionParams.transactionParameters,
        amount: +values.amount,
      });
    }
  };

  useEffect(() => {
    const country = getValues('country');
    createParams(+debouncedAmount, country);
  }, [createParams, debouncedAmount, getValues]);

  const allowReset = useRef(false);

  useEffect(() => {
    if (!debouncedAmount || !isValid) {
      resetRequest();
    }
  }, [debouncedAmount, isValid, resetRequest]);

  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name === 'country' && allowReset.current) {
        const parsedAmount = _values.amount ? +_values.amount : 0;
        if (
          parsedAmount &&
          !isNaN(parsedAmount) &&
          isFinite(parsedAmount) &&
          _values.country
        ) {
          createParams(+parsedAmount, _values.country);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      allowReset.current = true;
    };
  }, [watch, createParams]);

  const getDestinationCurrency = () => {
    const country = watch('country');
    if (!transactionParams) return country === 'NG' ? '₦' : '$';
    return transactionParams.transactionParameters.destinationCurrency === 'USD'
      ? '$'
      : '₦';
  };

  const exchangeRate = useMemo(() => {
    if (!transactionParams) return formatPrice(0, { fractionDigits: 2 });

    return formatPrice(transactionParams.transactionParameters.exchangeRate, {
      fractionDigits: 2,
      currency: transactionParams.transactionParameters.destinationCurrency,
      locale:
        transactionParams.transactionParameters.destinationCurrency === 'USD'
          ? 'en-US'
          : 'en-NG',
    });
  }, [transactionParams]);

  const totalAmount = useMemo(() => {
    if (!transactionParams) return formatPrice(0, { fractionDigits: 2 });
    const amount = +debouncedAmount;
    if (!isFinite(amount) || isNaN(amount))
      return formatPrice(0, { fractionDigits: 2 });

    const total = amount + transactionParams.transactionParameters.fee;
    return formatPrice(total, {
      fractionDigits: 2,
    });
  }, [debouncedAmount, transactionParams]);

  const recipientValue = useMemo(() => {
    if (!transactionParams) return 0;
    const amount = +debouncedAmount;
    if (!isFinite(amount) || isNaN(amount)) return 0;

    return amount * transactionParams.transactionParameters.exchangeRate;
  }, [debouncedAmount, transactionParams]);

  return (
    <>
      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <FormControl
            w="full"
            rounded="10px"
            borderWidth="1px"
            borderStyle="solid"
            borderColor={fieldState.error ? 'red.500' : '#CDCED0'}
            p="15px"
            isInvalid={!!fieldState.error}
          >
            <FormLabel color="#979797" fontWeight="500" fontSize="14px" mb="0">
              You send
            </FormLabel>

            <AmountInput value={field.value} onChange={field.onChange} />
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <VStack w="full" spacing="2">
        <StatLabel
          icon={<PlusIcon />}
          label="Transfer fee"
          value={formatPrice(
            transactionParams?.transactionParameters.fee ?? 0,
            { fractionDigits: 2 }
          )}
        />
        <StatLabel
          icon={<ExchangeIcon />}
          label="Exchange rate"
          value={exchangeRate}
        />
        <StatLabel
          icon={<EqualsIcon />}
          label={
            <Text fontWeight="700">Total amount to pay (Amount + Fee)</Text>
          }
          value={totalAmount}
        />
      </VStack>

      <FormControl
        w="full"
        rounded="10px"
        border="1px solid #CDCED0"
        p="15px"
        display="flex"
        flexDir="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <VStack w="full" align="flex-start" flex="1" spacing="0">
          <FormLabel color="#979797" fontWeight="500" fontSize="14px" mb="0">
            Beneficiary receives
          </FormLabel>

          <AmountInput
            minValue={0}
            currency={getDestinationCurrency()}
            value={recipientValue}
            formatter={(c) =>
              formatNumber(isFinite(+c) ? +c : 0, { fractionDigits: 2 })
            }
            isDisabled
          />
        </VStack>

        <VStack h="full" align="flex-start" spacing="1">
          <Text fontSize="12px" color="#979797">
            Select Country
          </Text>
          <HStack w="fit-content">
            {COUNTRIES_FLAGS[watch('country')]}
            <Select variant="unstyled" {...register('country')}>
              {COUNTRIES.filter(
                (c) => c.value.toLowerCase() === recipientCountry.toLowerCase()
              ).map((c) => (
                <option value={c.value}>{c.label}</option>
              ))}
            </Select>
          </HStack>
        </VStack>
      </FormControl>

      <Button
        mt="3"
        size="lg"
        fontSize="14px"
        w="full"
        variant={{ base: 'outline', lg: 'solid' }}
        isLoading={isLoading}
        onClick={onContinue}
        // isDisabled={watch('country') === 'NG'}
      >
        Continue
      </Button>
    </>
  );
}
