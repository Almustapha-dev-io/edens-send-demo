import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomPaginator from '@/components/ui/custom-paginator';
import ErrorPlaceholder from '@/components/ui/error-placeholder';
import { Loader } from '@/components/ui/loader';
import NoData from '@/components/ui/no-data';
import { TRANSACTION_DETAILS } from '@/constants';
import { formatPrice } from '@/lib/helpers';

import TransactionStatus from './transaction-status';
import TransactionType from './transaction-type';

function TransactionCard({ transaction }: { transaction: TTransaction }) {
  const navigate = useNavigate();

  return (
    <Button
      variant="unstyled"
      w="full"
      h="fit-content"
      display="block"
      onClick={() => navigate(TRANSACTION_DETAILS(transaction.id))}
    >
      <VStack
        w="full"
        rounded="10px"
        padding="15px"
        border="1px solid #F0F1F4"
        spacing="4"
        align="flex-start"
      >
        <TransactionType type={transaction.type} />

        <HStack w="full" justify="space-between" spacing="6">
          <VStack
            flex="1"
            w="full"
            justify="flex-start"
            align="flex-start"
            spacing="0"
          >
            <Heading
              as="h6"
              fontWeight="700"
              fontSize="12px"
              color="#979797"
              textTransform="uppercase"
            >
              Time
            </Heading>
            <Text fontWeight="400" fontSize="14px">
              {format(new Date(transaction.date), 'do MMMM yyyy')}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="#979797">
              {format(new Date(transaction.date), 'h:m:saaa')}
            </Text>
          </VStack>

          <VStack
            flex="1"
            w="full"
            justify="flex-start"
            align="flex-end"
            spacing="0"
          >
            <Heading
              as="h6"
              fontWeight="700"
              fontSize="12px"
              color="#979797"
              textTransform="uppercase"
              textAlign="end"
            >
              Beneficiary
            </Heading>
            <Text fontWeight="400" fontSize="14px" textAlign="end">
              {transaction.beneficiary}
            </Text>
            <Text
              fontWeight="400"
              fontSize="14px"
              color="#979797"
              textAlign="end"
            >
              {transaction.beneficiaryNumber}
            </Text>
          </VStack>
        </HStack>

        <Divider />

        <HStack w="full" justify="space-between" align="flex-end" spacing="4">
          <VStack flex="1" justify="flex-start" align="flex-start" spacing="0">
            <Heading
              as="h6"
              fontWeight="700"
              fontSize="12px"
              color="#979797"
              textTransform="uppercase"
            >
              Amount
            </Heading>
            <Text fontWeight="400" fontSize="14px">
              {formatPrice(transaction.amount, { fractionDigits: 2 })}
            </Text>
          </VStack>

          <TransactionStatus status={transaction.status} />
        </HStack>
      </VStack>
    </Button>
  );
}

type Props = {
  transactions: TTransaction[];
  isLoading?: boolean;

  isError?: boolean;
};
export default function TransactionsTableSm({
  transactions,
  isError,
  isLoading,
}: Props) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toFirstPage = useCallback(() => setPage(0), []);
  const toLastPage = useCallback(() => {}, []);

  const curTransactions = useMemo(
    () => transactions.slice(page * pageSize, page * pageSize + pageSize),
    [page, pageSize, transactions]
  );

  if (isLoading)
    return (
      <Center w="full" py="6" minH="250px">
        <Loader />
      </Center>
    );

  if (isError) {
    return <ErrorPlaceholder />;
  }

  if (!transactions.length) {
    return <NoData label="No transactions found!" />;
  }

  return (
    <VStack w="full" spacing="6" align="flex-start">
      {curTransactions.map((tr, i) => (
        <TransactionCard transaction={tr} key={i} />
      ))}

      <CustomPaginator
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        toFirstPage={toFirstPage}
        toLastPage={toLastPage}
        totalItems={transactions.length}
        totalPages={2}
        canNext={page < transactions.length - 1}
        canPrev={page > 0}
      />
    </VStack>
  );
}
