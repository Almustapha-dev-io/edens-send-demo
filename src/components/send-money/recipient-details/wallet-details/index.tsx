/* eslint-disable @typescript-eslint/indent */
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
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Case, Switch } from 'react-if';
import { toast } from 'react-toastify';

import CustomSelect from '@/components/ui/custom-select';
import { useSendMoneyContext } from '@/context/send-money';
import { useSendMoneySources } from '@/hooks/send-money';
import {
  setRecipientName,
  setSendMoneyRecipientDetails,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import {
  RecipientWalletSchema,
  TRecipientWallet,
} from '@/lib/validations/send-money';

import EdensWalletNumber from './edens-wallet-number';
import MomoWalletPhone from './momo-wallet-phone';

export default function WalletDetails() {
  const { recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendMoney
  );
  const dispatch = useAppDispatch();

  const getDefaultValues = (): Partial<TRecipientWallet> => {
    if (!recipientDetails) return {};

    const { details, category } = recipientDetails;
    if (category !== 'wallet') return {};

    return details;
  };

  const { wallets } = useSendMoneySources();

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TRecipientWallet>({
    resolver: zodResolver(RecipientWalletSchema),
    mode: 'all',
    defaultValues: getDefaultValues(),
  });

  const [walletType, setWalletType] = useState<
    TCustomSelectItem<string> | undefined
  >(() => wallets.find((w) => w.value === getDefaultValues().walletType));

  const { onNextPage, onPrevioussPage } = useSendMoneyContext();

  const isVerified = useRef(false);

  const submitHandler: SubmitHandler<TRecipientWallet> = () => {
    if (!isVerified.current)
      return toast.error('Enter a verified number!', {
        position: 'bottom-center',
      });

    onNextPage();
  };

  useEffect(() => {
    if (walletType) {
      setValue('walletType', walletType.value as 'EDENS360' | 'MTN_MOMO');
    }
  }, [dispatch, setValue, walletType]);

  useEffect(() => {
    const subsciption = watch((_values, { name }) => {
      dispatch(
        setSendMoneyRecipientDetails({
          category: 'wallet',
          details: _values as TRecipientWallet,
        })
      );

      if (name === 'walletType') {
        setValue('email', '');
        setValue('name', '');
        setValue('narration', '');
        setValue('phoneNumber', '');
        setValue('walletNumber', '');
        dispatch(setRecipientName(''));
        dispatch(setSendMoneyRecipientDetails());
      }
    });

    return () => {
      subsciption.unsubscribe();
    };
  }, [dispatch, setValue, watch]);

  return (
    <chakra.form
      w="full"
      display="flex"
      flexDirection="column"
      gap="6"
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormControl isInvalid={!!errors.walletType}>
        <FormLabel>Choose Wallet</FormLabel>
        <CustomSelect
          header="Choose Wallet"
          placeholder="Choose Wallet"
          value={walletType}
          onChange={setWalletType}
          options={wallets}
        />
      </FormControl>

      <Switch>
        <Case condition={watch('walletType') === 'EDENS360'}>
          <EdensWalletNumber control={control} isVerified={isVerified} />
        </Case>

        <Case condition={watch('walletType') === 'MTN_MOMO'}>
          <MomoWalletPhone control={control} isVerified={isVerified} />

          <FormControl isInvalid={'email' in errors}>
            <FormLabel>Recipient Email address (optional)</FormLabel>
            <Input
              size="lg"
              type="email"
              placeholder="eg. john@smith.com"
              {...register('email')}
            />
            {'email' in errors && (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={'name' in errors}>
            <FormLabel>Recipient Name</FormLabel>
            <Input size="lg" placeholder="eg. John Doe" {...register('name')} />
            {'name' in errors && (
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Case>
      </Switch>

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
