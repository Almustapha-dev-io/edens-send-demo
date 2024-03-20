import {
  Box,
  Button,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useNumberInput,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { If, Then } from 'react-if';
import { toast } from 'react-toastify';

import { CARD_SHADOW } from '@/constants';
import { useSendAirtimeContext } from '@/context/send-airtime';
import { formatNumber } from '@/lib/helpers';
import {
  setSendAirtimeAmount,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

import ArrowLeftSmIcon from '../icons/arrow-left-sm-icon';
import DotIcon from '../icons/dot-icon';

const MAX_AMOUNT = 5_000;

const BUTTONS = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: <DotIcon />, value: '.' },
  { label: '0', value: '0' },
  { label: <ArrowLeftSmIcon width="30px" height="30px" />, value: 'backspace' },
];

export default function AmountForm() {
  const dispatch = useAppDispatch();
  const { amount, recipientDetails } = useAppSelector(
    (s) => s.transactionParams.sendAirtime
  );

  const [value, setValue] = useState(() => amount?.toString() ?? '0');
  const shouldValidate = useRef(false);

  const { getInputProps } = useNumberInput({
    defaultValue: value,
    min: recipientDetails ? +recipientDetails.product.value.min_amount : 0,
    max: recipientDetails
      ? +recipientDetails.product.value.max_amount
      : MAX_AMOUNT,
    clampValueOnBlur: true,
    onChange: setValue,
  });

  const input = getInputProps();

  const handleClick = (increment: string) => {
    setValue((prev) => {
      let prevValue = prev.replace(',', '');
      if (increment === 'backspace') {
        return prevValue === '' ? prevValue : prevValue.slice(0, -1);
      }

      if (increment === '.') {
        if (prevValue.includes('.')) return prevValue;
        return prevValue === '' ? '0.' : `${prevValue}.`;
      }

      if (prevValue.startsWith('0')) {
        prevValue = prevValue.slice(1);
      }

      return `${prevValue}${increment}`;
    });
  };

  const { onNextPage, onPreviousPage } = useSendAirtimeContext();

  const checkValidity = useCallback(() => {
    const parsedValue = parseFloat(value);

    const maxAmount = recipientDetails
      ? +recipientDetails.product.value.max_amount
      : MAX_AMOUNT;

    const minAmount = recipientDetails
      ? +recipientDetails.product.value.min_amount
      : 0;

    return (
      !isNaN(parsedValue) &&
      isFinite(parsedValue) &&
      parsedValue > minAmount &&
      parsedValue <= maxAmount
    );
  }, [recipientDetails, value]);

  const isValid = useMemo(() => {
    if (!shouldValidate.current) return true;
    return checkValidity();
  }, [checkValidity]);

  useEffect(() => {
    if (!shouldValidate.current) {
      shouldValidate.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (isFinite(+value) && !isNaN(+value)) {
      dispatch(setSendAirtimeAmount(value));
    }
  }, [dispatch, value]);

  return (
    <VStack w="519px" maxW="full" spacing="6">
      <Heading
        as="h1"
        fontSize={{ base: '24px', md: '36px' }}
        fontWeight="700"
        textAlign="center"
      >
        How much are you sending to {recipientDetails?.phoneNumber ?? '-'}?
      </Heading>

      <Heading as="h2" fontSize="14px" fontWeight="400" textAlign="center">
        input the amount you are sending.
      </Heading>

      <VStack
        align="flex-start"
        w="full"
        shadow={{ base: 'none', lg: CARD_SHADOW }}
        rounded={{ base: 'none', lg: '20px' }}
        bg={{ base: 'transparent', lg: '#fff' }}
        spacing="6"
        px={{ base: 0, lg: '30px' }}
        py={{ base: 2, md: 10 }}
      >
        <VStack
          w="full"
          align="flex-start"
          rounded="10px"
          p="15px"
          borderWidth="1px"
          borderStyle="solid"
          borderColor={isValid ? '#CDCED0' : 'red.500'}
        >
          <Heading color="#979797" fontWeight="400" fontSize="14px">
            You send
          </Heading>
          <HStack w="full" justify="space-between" align="flex-end">
            <Box
              flex="1"
              fontWeight="700"
              fontSize="24px"
              display="flex"
              alignItems="flex-end"
              w="full"
            >
              <Editable flex="1" w="full" value={value} onChange={setValue}>
                <EditablePreview p="0" w="full" minW="full" />

                <EditableInput w="full" p="0" {...input} />
              </Editable>
            </Box>
            <Text color="#979797" fontWeight="400" fontSize="14px">
              Max{' '}
              {formatNumber(
                recipientDetails
                  ? +recipientDetails.product.value.max_amount
                  : MAX_AMOUNT
              )}
            </Text>
          </HStack>
          <If condition={!isValid}>
            <Then>
              <Text fontSize="14px" color="red.500">
                Enter a valid amount
              </Text>
            </Then>
          </If>
        </VStack>

        <SimpleGrid w="full" columns={3} spacing="4">
          {BUTTONS.map((btn) => (
            <chakra.button
              w="full"
              rounded="10px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={btn.value}
              p="10px"
              fontSize="32px"
              transition="all 0.2s"
              _hover={{
                bg: 'primary.50',
              }}
              _active={{
                bg: 'primary.100',
              }}
              onClick={handleClick.bind(null, btn.value)}
            >
              {btn.label}
            </chakra.button>
          ))}
        </SimpleGrid>

        <VStack w="full" spacing="4" mt="3">
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant={{ base: 'outline', lg: 'solid' }}
            onClick={() => {
              const isAmntValid = checkValidity();
              if (!isAmntValid) {
                return toast(
                  `Enter a valid amount between ${recipientDetails?.product.value.min_amount} and ${recipientDetails?.product.value.max_amount}`,
                  {
                    type: 'error',
                    position: 'bottom-center',
                  }
                );
              }

              onNextPage();
            }}
          >
            Continue
          </Button>
          <Button
            size="lg"
            fontSize="14px"
            w="full"
            variant="ghost"
            onClick={onPreviousPage}
          >
            Back
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
