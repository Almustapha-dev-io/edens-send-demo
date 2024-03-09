import { Box, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';

type Props = {
  transaction: TTransaction;
};

export default function Update({ transaction }: Props) {
  return (
    <VStack w="full" h="fit-content" spacing="0" p="0">
      <HStack
        w="full"
        h="fit-content"
        minH="100px"
        justify="flex-start"
        align="flex-start"
        spacing="6"
        p="0"
      >
        <VStack align="flex-start" spacing="0" color="#6A7891">
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'E do,')}
          </Text>
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'MMM yyyy')}
          </Text>
        </VStack>
        <VStack h="100px" minH="fit-content" spacing="0">
          <Box bg="#92CCBF" flexShrink="0" w="8px" h="8px" rounded="full" />
          <Divider borderColor="#92CCBF" orientation="vertical" flex="1" />
        </VStack>
        <VStack w="full" flex="1" align="flex-start">
          <Text fontSize="14px" fontWeight="400" color="#6A7891">
            Transfer request created
          </Text>
        </VStack>
      </HStack>

      <HStack
        w="full"
        h="fit-content"
        minH="100px"
        justify="flex-start"
        align="flex-start"
        spacing="6"
        p="0"
      >
        <VStack align="flex-start" spacing="0" color="#6A7891">
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'E do,')}
          </Text>
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'MMM yyyy')}
          </Text>
        </VStack>
        <VStack h="100px" minH="fit-content" spacing="0">
          <Box bg="#92CCBF" flexShrink="0" w="8px" h="8px" rounded="full" />
          <Divider borderColor="#92CCBF" orientation="vertical" flex="1" />
        </VStack>
        <VStack w="full" flex="1" align="flex-start">
          <Text fontSize="14px" fontWeight="400" color="#6A7891">
            Transfer request sent to “Momo”
          </Text>
        </VStack>
      </HStack>

      <HStack
        w="full"
        h="fit-content"
        minH="100px"
        justify="flex-start"
        align="flex-start"
        spacing="6"
        p="0"
      >
        <VStack align="flex-start" spacing="0" color="#6A7891">
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'E do,')}
          </Text>
          <Text fontSize="14px" fontWeight="400">
            {format(new Date(transaction.date), 'MMM yyyy')}
          </Text>
        </VStack>
        <VStack h="100px" minH="fit-content" spacing="0">
          <Box bg="#92CCBF" flexShrink="0" w="8px" h="8px" rounded="full" />
          {/* <Divider borderColor="#92CCBF" orientation="vertical" flex="1" /> */}
        </VStack>
        <VStack w="full" flex="1" align="flex-start">
          <Heading color="#1A1A2F" fontWeight="700" fontSize="14px">
            Customer account credited
          </Heading>
          <Text fontSize="14px" fontWeight="400" color="#6A7891">
            Transfer request created
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
