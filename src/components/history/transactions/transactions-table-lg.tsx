import { Badge, HStack, Text, VStack } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/ui/datatables';
import { TRANSACTION_DETAILS } from '@/constants';
import { formatPrice } from '@/lib/helpers';

import TransactionStatus from './transaction-status';

type Props = {
  transactions: TTransaction[];
  isLoading?: boolean;
  isError?: boolean;
};

export default function TransactionsTableLg({
  transactions,
  isLoading,
  isError,
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
              {format(new Date(row.date), 'do MMMM yyyy')}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="#979797">
              {format(new Date(row.date), 'h:m:saaa')}
            </Text>
          </VStack>
        ),
      },
      {
        header: 'Type',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <Badge
            rounded="20px"
            py="5px"
            px="10px"
            bg="#F0F0F0"
            fontWeight="400"
            fontSize="12px"
            textTransform="capitalize"
          >
            {row.type}
          </Badge>
        ),
      },
      {
        header: 'Beneficiary',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <VStack w="full" align="flex-start" spacing="0">
            <Text fontWeight="400" fontSize="14px">
              {row.beneficiary}
            </Text>
            <Text fontWeight="400" fontSize="14px" color="#979797">
              {row.beneficiaryNumber}
            </Text>
          </VStack>
        ),
      },
      {
        header: 'Amount',
        cell: (info) => info.getValue(),
        accessorFn: (row) => (
          <Text fontWeight="400" fontSize="14px">
            {formatPrice(row.amount)}
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
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={transactions}
      isError={isError}
      isLoading={isLoading}
      handleRowClick={(tr) => navigate(TRANSACTION_DETAILS(tr.id))}
    />
  );
}
