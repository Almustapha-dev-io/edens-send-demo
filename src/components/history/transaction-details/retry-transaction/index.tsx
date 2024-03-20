import {
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
import { If, Then } from 'react-if';

import DiamondExclamationIcon from '@/components/icons/diamond-exclamation-icon';
import { snakeToFlat } from '@/lib/helpers';

import AirtimePhoneNumber from './airtime-phone-number';
import BankAccountNumber from './bank-account-number';
import EdensWalletNumber from './edens-wallet-number';
import MomoWalletPhone from './momo-wallet-phone';

type Props = {
  isOpen: boolean;
  transaction: TTransaction;
  onClose(): void;
};

export default function RetryTransaction({
  isOpen,
  onClose,
  transaction,
}: Props) {
  const walletName = useMemo(() => {
    if (transaction.type.toLowerCase() === 'airtime') {
      return 'airtime';
    }

    if (transaction.beneficiary_wallet_name) {
      return snakeToFlat(transaction.beneficiary_wallet_name).toLowerCase();
    }

    if (transaction.beneficiary_type) {
      return snakeToFlat(transaction.beneficiary_type).toLowerCase();
    }

    return '';
  }, [
    transaction.beneficiary_type,
    transaction.beneficiary_wallet_name,
    transaction.type,
  ]);

  const airtimeTransactionDetails = useMemo(() => {
    if (
      !transaction.beneficiary_phone_number ||
      transaction.type !== 'AIRTIME'
    ) {
      return {
        isAirtime: false,
        phone: '',
      };
    }

    return {
      isAirtime: true,
      phone: transaction.beneficiary_phone_number,
    };
  }, [transaction.beneficiary_phone_number, transaction.type]);

  const walletTransactionDetails = useMemo(() => {
    if (
      !transaction.beneficiary_type ||
      !transaction.beneficiary_wallet_name ||
      transaction.type !== 'CASH_TRANSFER' ||
      !transaction.beneficiary_account_number
    ) {
      return {
        isWallet: false,
        country: '',
        walletName: '',
        accountNumber: '',
      };
    }

    const [country] = transaction.beneficiary_type.split('_');
    if (!country) {
      return {
        isWallet: false,
        country: '',
        walletName: '',
        accountNumber: '',
      };
    }

    return {
      isWallet: true,
      country,
      walletName: transaction.beneficiary_wallet_name,
      accountNumber: transaction.beneficiary_account_number,
    };
  }, [
    transaction.beneficiary_account_number,
    transaction.beneficiary_type,
    transaction.beneficiary_wallet_name,
    transaction.type,
  ]);

  const bankTransactionDetails = useMemo(() => {
    if (
      !transaction.beneficiary_type ||
      !transaction.beneficiary_bank_code ||
      transaction.type !== 'CASH_TRANSFER' ||
      !transaction.beneficiary_account_number
    ) {
      return {
        isBank: false,
        country: '',
        bankCode: '',
        accountNumber: '',
      };
    }

    const [country] = transaction.beneficiary_type.split('_');
    if (!country) {
      return {
        isBank: false,
        country: '',
        bankCode: '',
        accountNumber: '',
      };
    }

    return {
      isBank: true,
      country,
      bankCode: transaction.beneficiary_bank_code,
      accountNumber: transaction.beneficiary_account_number,
    };
  }, [
    transaction.beneficiary_account_number,
    transaction.beneficiary_type,
    transaction.beneficiary_bank_code,
    transaction.type,
  ]);

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
          <VStack w="full" spacing="20px" align="flex-start">
            <DiamondExclamationIcon />

            <Heading fontWeight="700" fontSize={{ base: '20px', md: '24px' }}>
              Edit & retry
            </Heading>

            <Text fontWeight="400" fontSize="14px" color="#6A7891">
              Edit account details below
            </Text>

            <HStack w="full" px="4" py="5" rounded="10px" bg="#E5F1F1">
              <Text textTransform="capitalize">{walletName}</Text>
            </HStack>

            <If condition={walletTransactionDetails.isWallet}>
              <Then>
                <If
                  condition={walletTransactionDetails.walletName === 'EDENS360'}
                >
                  <Then>
                    <EdensWalletNumber
                      country={walletTransactionDetails.country}
                      onClose={onClose}
                      transaction={transaction}
                      walletType={walletTransactionDetails.walletName}
                      defaultValue={walletTransactionDetails.accountNumber}
                    />
                  </Then>
                </If>

                <If
                  condition={walletTransactionDetails.walletName === 'MTN_MOMO'}
                >
                  <Then>
                    <MomoWalletPhone
                      country={walletTransactionDetails.country}
                      onClose={onClose}
                      transaction={transaction}
                      walletType={walletTransactionDetails.walletName}
                      defaultValue={walletTransactionDetails.accountNumber}
                    />
                  </Then>
                </If>
              </Then>
            </If>

            <If condition={bankTransactionDetails.isBank}>
              <Then>
                <BankAccountNumber
                  bankCode={bankTransactionDetails.bankCode}
                  country={bankTransactionDetails.country}
                  defaultValue={bankTransactionDetails.accountNumber}
                  onClose={onClose}
                  transaction={transaction}
                />
              </Then>
            </If>

            <If condition={airtimeTransactionDetails.isAirtime}>
              <Then>
                <AirtimePhoneNumber
                  defaultValue={airtimeTransactionDetails.phone}
                  transaction={transaction}
                  onClose={onClose}
                />
              </Then>
            </If>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
