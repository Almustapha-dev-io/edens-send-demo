import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/ui/datatables';
import RouterLink from '@/components/ui/router-link';
import { RESEND_TRANSACTION, TRANSACTION_DETAILS } from '@/constants';
import { formatPrice, snakeToFlat } from '@/lib/helpers';

import TransactionStatus from './transaction-status';
import TransactionType from './transaction-type';

type Props = {
  transactions: TTransaction[];
  isLoading?: boolean;
  isError?: boolean;
  refetch?(): void;
};

export default function TransactionsTableLg({
  transactions,
  isLoading,
  isError,
  refetch,
}: Props) {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<TTransaction>[]>(
    () => [
      {
        header: 'Time',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <VStack w="full" align="flex-start" spacing="0">
            <Text fontWeight="400" fontSize="14px">
              {format(new Date(row.created_at), 'do MMMM yyyy')}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="#979797">
              {format(new Date(row.created_at), 'h:m:saaa')}
            </Text>
          </VStack>
        ),
      },
      {
        header: 'Type',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <TransactionType type={snakeToFlat(row.type).toLowerCase()} />
        ),
      },
      {
        header: 'Beneficiary',
        cell: (info) => info.getValue(),
        accessorFn: (row) => {
          const accountCategory =
            row.beneficiary_wallet_name ?? row.beneficiary_type;
          const name =
            row.beneficiary_account_number ?? row.beneficiary_phone_number;

          return (
            <VStack w="full" align="flex-start" spacing="0">
              <Text fontWeight="400" fontSize="14px">
                {row.beneficiary_name ?? ''}
              </Text>
              <Text fontWeight="400" fontSize="14px" color="#979797">
                {`${name ?? '-'} | ${accountCategory ? snakeToFlat(accountCategory) : 'Airtime'}`}
              </Text>
            </VStack>
          );
        },
      },
      {
        header: 'Amount',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <Text fontWeight="400" fontSize="14px">
            {formatPrice(
              isFinite(+row.amount) && !isNaN(+row.amount)
                ? +row.amount / 100
                : 0,
              { fractionDigits: 2 }
            )}
          </Text>
        ),
      },
      {
        header: 'Status',
        cell: (info) => info.getValue(),
        meta: {
          isNumeric: true,
        },
        accessorFn: (row) => (
          <HStack w="full" justify="flex-end">
            <TransactionStatus status={row.status} />
          </HStack>
        ),
      },
      {
        header: 'Action',
        cell: (info) => info.getValue(),
        meta: {
          isNumeric: true,
        },
        accessorFn: (row) => (
          <RouterLink
            to={RESEND_TRANSACTION(row.reference)}
            onClick={(e) => e.stopPropagation()}
          >
            <Button size="xs" minH="28px" fontWeight="400" px="4">
              Resend
            </Button>
          </RouterLink>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={transactions}
      isError={isError}
      isLoading={isLoading}
      handleRowClick={(tr) => navigate(TRANSACTION_DETAILS(tr.reference))}
      retryFetch={refetch}
    />
  );
}
