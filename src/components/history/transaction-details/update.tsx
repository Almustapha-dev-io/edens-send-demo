import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { If, Then } from 'react-if';

import NoData from '@/components/ui/no-data';

import RetryTransaction from './retry-transaction';

type Props = {
  transaction: TTransaction;
};

export default function Update({ transaction }: Props) {
  const {
    isOpen: isRetryOpen,
    onClose: onCloseRetry,
    onOpen: onOpenRetry,
  } = useDisclosure();

  if (!transaction.progress_report.length) {
    return <NoData label="No updates yet!" />;
  }

  return (
    <>
      <RetryTransaction
        transaction={transaction}
        isOpen={isRetryOpen}
        onClose={onCloseRetry}
      />

      <VStack w="full" h="fit-content" spacing="0" p="0">
        {transaction.progress_report.map((p, i) => (
          <HStack
            w="full"
            h="fit-content"
            minH="100px"
            justify="flex-start"
            align="flex-start"
            spacing="6"
            p="0"
            key={i}
          >
            {!!p.timestamp && (
              <VStack mt="-4px" align="flex-start" spacing="0" color="#6A7891">
                <Text fontSize="14px" fontWeight="400">
                  {format(new Date(p.timestamp), 'E do,')}
                </Text>
                <Text fontSize="14px" fontWeight="400">
                  {format(new Date(p.timestamp), 'MMM yyyy')}
                </Text>
              </VStack>
            )}

            <VStack h="150px" minH="fit-content" spacing="0">
              <Box bg="#92CCBF" flexShrink="0" w="8px" h="8px" rounded="full" />
              <If condition={i !== transaction.progress_report.length - 1}>
                <Then>
                  <Divider
                    borderColor="#92CCBF"
                    orientation="vertical"
                    flex="1"
                  />
                </Then>
              </If>
            </VStack>
            <VStack w="full" flex="1" align="flex-start">
              <If condition={!!p.failure_reason}>
                <Then>
                  <Heading
                    color={
                      transaction.status.toLowerCase() === 'failed'
                        ? 'red.500'
                        : '#1A1A2F'
                    }
                    fontWeight="700"
                    fontSize="14px"
                  >
                    {p.failure_reason}
                  </Heading>
                </Then>
              </If>
              <Text fontSize="14px" fontWeight="400" color="#6A7891">
                {p.message ?? '-'}
              </Text>

              <If
                condition={
                  i === transaction.progress_report.length - 1 &&
                  p.status === false
                }
              >
                <Then>
                  <Button
                    variant="outline"
                    size="sm"
                    fontWeight="400"
                    onClick={onOpenRetry}
                  >
                    Edit & Retry
                  </Button>
                </Then>
              </If>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </>
  );
}
