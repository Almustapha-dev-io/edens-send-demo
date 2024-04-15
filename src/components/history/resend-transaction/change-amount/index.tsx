/* eslint-disable @typescript-eslint/indent */
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

import { TTransactionParamsRes } from '@/lib/redux/slices/api-slice/builders';

import ChangeAirtimeAmount from './change-airtime-amount';
import ChangeCashAmount from './change-cash-amount';

type Props =
  | {
      isOpen: boolean;
      onClose(): void;
      type: 'cash';
      transaction: TTransaction;
      onComplete(value: TTransactionParamsRes & { amount: number }): void;
    }
  | {
      isOpen: boolean;
      onClose(): void;
      type: 'airtime';
      transaction: TTransaction;
      onComplete(amount: string): void;
    };

export default function ChangeAmount({
  isOpen,
  onClose,
  type,
  transaction,
  onComplete,
}: Props) {
  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody px={{ base: '4', md: '30px' }} py="40px">
          <VStack w="full" spacing="20px" align="flex-start">
            <Heading fontWeight="700" fontSize="20px">
              Change Amount
            </Heading>

            {type === 'cash' && (
              <ChangeCashAmount
                transaction={transaction}
                onComplete={(value) => {
                  onComplete(value);
                  onClose();
                }}
              />
            )}

            {type === 'airtime' && (
              <ChangeAirtimeAmount
                onComplete={(value) => {
                  onComplete(value);
                  onClose();
                }}
                transaction={transaction}
              />
            )}

            <Button
              w="full"
              size="lg"
              fontSize="sm"
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
