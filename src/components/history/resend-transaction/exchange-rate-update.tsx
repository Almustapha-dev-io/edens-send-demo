import {
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import ArrowLeftSmIcon from '@/components/icons/arrow-left-sm-icon';
import DiamondExclamationIcon from '@/components/icons/diamond-exclamation-icon';
import EqualsIcon from '@/components/icons/equals-icon';
import ExchangeIcon from '@/components/icons/exchange-icon';
import NgFlagIcon from '@/components/icons/ng-flag-icon';
import PlusIcon from '@/components/icons/plus-icon';
import StatLabel from '@/components/send-money/send-money-form/stat-label';
import RouterLink from '@/components/ui/router-link';
import { formatPrice } from '@/lib/helpers';

type Props = {
  isOpen: boolean;
  onClose(): void;
  params?: Record<'transactionParameters', TTtransactionParams>;
  transaction: TTransaction;
};

export default function ExchangeRateUpdate({
  isOpen,
  onClose,
  params,
  transaction,
}: Props) {
  const formattedAmount = useMemo(
    () => ({
      amount:
        isNaN(+transaction.amount) || !isFinite(+transaction.amount)
          ? 0
          : +transaction.amount / 100,
      fee:
        isNaN(+transaction.fee) || !isFinite(+transaction.fee)
          ? 0
          : +transaction.fee / 100,
    }),
    [transaction.amount, transaction.fee]
  );

  const totalAmount = useMemo(() => {
    if (!params) return formatPrice(0, { fractionDigits: 2 });

    const total = formattedAmount.amount + params.transactionParameters.fee;
    return formatPrice(total, {
      fractionDigits: 2,
    });
  }, [params, formattedAmount.amount]);

  const exchangeRate = useMemo(() => {
    if (!params) return '-';
    return formatPrice(params.transactionParameters.exchangeRate, {
      fractionDigits: 2,
      currency: params.transactionParameters.destinationCurrency,
      locale:
        params.transactionParameters.destinationCurrency === 'USD'
          ? 'en-US'
          : 'en-NG',
    });
  }, [params]);

  const recipientValue = useMemo(() => {
    if (!params) return 0;

    return formattedAmount.amount * params.transactionParameters.exchangeRate;
  }, [params, formattedAmount.amount]);

  let content = <></>;

  if (params) {
    content = (
      <VStack w="full" spacing="20px" align="flex-start">
        <DiamondExclamationIcon />

        <VStack align="flex-start" spacing="0">
          <Heading fontWeight="700" fontSize="20px">
            Exchange rate Update!
          </Heading>
          <Text fontSize="14px">Our exchange rate has been updated</Text>
        </VStack>

        <HStack
          w="full"
          spacing="4"
          justify="space-between"
          pb="4"
          borderBottom="1px solid #DDDDDD"
        >
          <VStack align="flex-start" spacing="0">
            <Text fontSize="14px" color="#002026">
              Rate
            </Text>
            <Text fontSize="14px" fontWeight="700" color="#38C16F">
              {formatPrice(+params.transactionParameters.exchangeRate, {
                fractionDigits: 2,
                locale: 'en-NG',
                currency: 'NGN',
              })}
            </Text>
          </VStack>
        </HStack>

        <Heading fontSize="14px" fontWeight="700">
          Breakdown
        </Heading>

        <VStack w="full" spacing="4">
          <StatLabel
            icon={
              <ArrowLeftSmIcon
                width="10"
                height="11"
                style={{ transform: 'rotate(180deg)' }}
              />
            }
            label="You send"
            value={formatPrice(+formattedAmount.amount ?? 0, {
              fractionDigits: 2,
            })}
          />

          <StatLabel
            icon={<PlusIcon />}
            label="Transfer fee"
            value={formatPrice(params.transactionParameters.fee ?? 0, {
              fractionDigits: 2,
            })}
          />

          <StatLabel
            icon={<EqualsIcon />}
            label={
              <Text fontWeight="700">Total amount to pay (Amount + Fee)</Text>
            }
            value={totalAmount}
          />

          <StatLabel
            icon={<ExchangeIcon />}
            label="Exchange rate"
            value={exchangeRate}
          />

          <StatLabel
            icon={<NgFlagIcon width="16px" height="16px" />}
            label="Beneficiary receives"
            value={formatPrice(recipientValue, {
              currency: 'NGN',
              fractionDigits: 2,
              locale: 'en-NG',
            })}
          />
        </VStack>

        <VStack w="full" spacing="4">
          <Button fontSize="14px" w="full" size="lg" onClick={onClose}>
            Confirm
          </Button>
          <RouterLink w="full" to="/">
            <Button fontSize="14px" variant="ghost" w="full" size="lg">
              Cancel and restart
            </Button>
          </RouterLink>
        </VStack>
      </VStack>
    );
  }

  return (
    <Modal
      size="md"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody px={{ base: '4', md: '30px' }} py="40px">
          {content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
