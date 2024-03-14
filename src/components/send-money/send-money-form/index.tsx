import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDebounceValue } from 'usehooks-ts';

import EqualsIcon from '@/components/icons/equals-icon';
import ExchangeIcon from '@/components/icons/exchange-icon';
import LrFlagIcon from '@/components/icons/lr-flag-icon';
import NgFlagIcon from '@/components/icons/ng-flag-icon';
import RemoveIcon from '@/components/icons/remove-icon';
import { CARD_SHADOW } from '@/constants';
import { useSendMoneyContext } from '@/context/send-money';
import { useCreateTransactionsParams } from '@/hooks/send-money';
import { formatNumber, formatPrice } from '@/lib/helpers';
import {
  resetSendMoney,
  setSendMoneyTransactionsParams,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { TMutationCreatorResult } from '@/lib/redux/slices/api-slice/types';
import {
  SendMoneyAmountSchema,
  TSendMoneyAmount,
} from '@/lib/validations/send-money';

import AmountInput from './amount-input';
import StatLabel from './stat-label';

const COUNTRIES = ['LR', 'NG'];
const COUNTRIES_FLAGS: Record<string, ReactNode> = {
  LR: <LrFlagIcon width="24px" height="24px" style={{ flexShrink: 0 }} />,
  NG: <NgFlagIcon width="24px" height="24px" style={{ flexShrink: 0 }} />,
};

export default function SendMoneyForm() {
  const dispatch = useAppDispatch();
  const sendMoneyParams = useAppSelector((s) => s.transactionParams.sendMoney);

  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<TSendMoneyAmount>({
    resolver: zodResolver(SendMoneyAmountSchema),
    defaultValues: { amount: sendMoneyParams?.amount ?? 0 },
    mode: 'all',
  });

  const [debouncedAmount] = useDebounceValue(watch('amount'), 250);
  const [country, setCountry] = useState<string>(
    sendMoneyParams.country || 'LR'
  );
  const { onNextPage } = useSendMoneyContext();
  const {
    createTransactionsParamsMutation,
    isLoading,
    data: transactionParams,
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

  const submitHandler: SubmitHandler<TSendMoneyAmount> = (values) => {
    if (!transactionParams) {
      toast('Enter your transaction details', {
        type: 'warning',
        position: 'bottom-center',
      });
      return;
    }

    dispatch(
      setSendMoneyTransactionsParams({
        country,
        amount: values.amount,
        ...transactionParams.transactionParameters,
      })
    );
    onNextPage();
  };

  useEffect(() => {
    createParams(+debouncedAmount, country);
  }, [country, createParams, debouncedAmount]);

  const allowReset = useRef(false);

  useEffect(() => {
    if (allowReset.current) {
      dispatch(resetSendMoney());
    }

    return () => {
      allowReset.current = true;
    };
  }, [country, dispatch]);

  const getDestinationCurrency = () => {
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
    <chakra.form w="519px" maxW="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="6">
        <Heading
          as="h1"
          fontSize={{ base: '24px', md: '36px' }}
          fontWeight="700"
          textAlign="center"
        >
          Send money today
        </Heading>

        <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
          Pay any Edens360 or MTN momo wallet instantly
        </Heading>

        <VStack
          w="full"
          shadow={{ base: 'none', lg: CARD_SHADOW }}
          rounded={{ base: 'none', lg: '20px' }}
          bg={{ base: 'transparent', lg: '#fff' }}
          spacing="6"
          px={{ base: '0', lg: '30px' }}
          py={{ base: 1, md: 10 }}
        >
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
                <FormLabel
                  color="#979797"
                  fontWeight="500"
                  fontSize="14px"
                  mb="0"
                >
                  You send
                </FormLabel>

                <AmountInput value={field.value} onChange={field.onChange} />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <VStack w="full" spacing="2">
            <StatLabel
              icon={<RemoveIcon />}
              label="Transfer fee"
              value={formatPrice(
                transactionParams?.transactionParameters.fee ?? 0,
                { fractionDigits: 2 }
              )}
            />
            <StatLabel
              icon={<EqualsIcon />}
              label="Total amount to pay (Amount + Fee)"
              value={totalAmount}
            />
            <StatLabel
              icon={<ExchangeIcon />}
              label="Exchange rate"
              value={exchangeRate}
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
              <FormLabel
                color="#979797"
                fontWeight="500"
                fontSize="14px"
                mb="0"
              >
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
                {COUNTRIES_FLAGS[country]}
                <Select
                  variant="unstyled"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option value={c}>{c}</option>
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
            type="submit"
            isLoading={isLoading}
          >
            Continue
          </Button>
        </VStack>
      </VStack>
    </chakra.form>
  );
}
