import { HStack, VStack } from '@chakra-ui/react';

import Receipt from './receipt';
import Update from './update';

type Props = {
  transaction: TTransaction;
};

export default function TransactionDetailsLg({ transaction }: Props) {
  return (
    <HStack
      w="full"
      spacing="8"
      align="flex-start"
      justify="flex-start"
      position="relative"
    >
      <VStack
        flex="1"
        w="full"
        h="fit-content"
        bg="#FFFFFF"
        py="40px"
        px="30px"
        rounded="10px"
        position="sticky"
        top="100px"
      >
        <Update transaction={transaction} />
      </VStack>

      <VStack
        flex="1"
        w="full"
        h="fit-content"
        bg="#FFFFFF"
        py="40px"
        px="30px"
        rounded="10px"
      >
        <Receipt transaction={transaction} />
      </VStack>
    </HStack>
  );
}
