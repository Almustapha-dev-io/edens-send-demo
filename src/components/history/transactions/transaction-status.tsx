import { Box, HStack, Text } from '@chakra-ui/react';

export default function TransactionStatus({ status }: { status: string }) {
  return (
    <HStack
      px="10px"
      py="5px"
      color="#000"
      rounded="20px"
      bg="#F0F0F0"
      w="83px"
      minW="fit-content"
    >
      <Box flexShrink="0" w="9px" h="9px" bg="green.500" rounded="full" />
      <Text fontWeight="400" fontSize="12px">
        {status}
      </Text>
    </HStack>
  );
}
