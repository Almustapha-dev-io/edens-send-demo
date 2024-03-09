/* eslint-disable @typescript-eslint/indent */
import {
  Box,
  Center,
  Table as ChakraTable,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ReactNode } from 'react';

import { TABLE_SHADOW } from '@/constants';

import Paginator from '../custom-paginator';
import ErrorPlaceholder from '../error-placeholder';
import { Loader } from '../loader';
import NoData from '../no-data';

type Props<T> = {
  data: T[];
  title?: string;
  columns: ColumnDef<T>[];
  handleRowClick?(data: T): unknown;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  retryFetch?(): unknown;
  hidePaginator?: boolean;
  action?: ReactNode;
} & Omit<TableContainerProps, 'children'>;

export default function DataTable<T>({
  title,
  columns,
  data,
  handleRowClick,
  isError,
  isLoading,
  isFetching,
  retryFetch,
  hidePaginator,
  action,
  ...rest
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: import.meta.env.DEV,
  });

  let content = (
    <TableContainer
      w="full"
      bg="#fff"
      shadow={TABLE_SHADOW}
      rounded="10px"
      className="custom__scroll"
      p="20px"
      {...rest}
    >
      <ChakraTable w="full">
        <Thead bg="#F9F9F9">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  colSpan={header.colSpan}
                  textTransform="uppercase"
                  pt="25px"
                  pb="21px"
                  bg="#fff"
                  fontSize="14px"
                  fontWeight="700"
                  letterSpacing="0.14px"
                  lineHeight="150%"
                  color="#979797"
                  borderBottomColor="#F0F1F4"
                  isNumeric={
                    header.column.columnDef.meta &&
                    'isNumeric' in header.column.columnDef.meta
                      ? !!header.column.columnDef.meta.isNumeric
                      : false
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr
              key={row.id}
              onClick={() => {
                if (handleRowClick) {
                  handleRowClick(row.original);
                }
              }}
              cursor={handleRowClick ? 'pointer' : 'default'}
              transition="all .5s"
              _hover={{
                bg: handleRowClick ? 'gray.50' : undefined,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  fontSize="14px"
                  fontWeight="300"
                  lineHeight="150%"
                  letterSpacing="0.14px"
                  borderBottomColor="#F0F1F4"
                  py="6"
                  isNumeric={
                    cell.column.columnDef.meta &&
                    'isNumeric' in cell.column.columnDef.meta
                      ? !!cell.column.columnDef.meta.isNumeric
                      : false
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      {!hidePaginator && (
        <Box w="full" mt="0" pt="24px" pb="20px">
          <Paginator
            page={table.getState().pagination.pageIndex}
            pageSize={table.getState().pagination.pageSize}
            totalPages={table.getPageCount()}
            totalItems={data.length}
            setPage={table.setPageIndex}
            setPageSize={table.setPageSize}
            toFirstPage={() => table.setPageIndex(0)}
            toLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
            canNext={table.getCanNextPage()}
            canPrev={table.getCanPreviousPage()}
          />
        </Box>
      )}
    </TableContainer>
  );

  if (!data.length) {
    content = (
      <NoData
        h="400px"
        py="24"
        label={isFetching ? '' : 'No Data'}
        retryHandler={retryFetch}
        isLoading={isFetching}
        bg="#fff"
        shadow={TABLE_SHADOW}
        rounded="10px"
      />
    );
  }

  if (isError && !isLoading) {
    content = (
      <ErrorPlaceholder
        h="400px"
        py="24"
        retryHandler={retryFetch}
        label={isFetching ? '' : undefined}
        isLoading={isFetching}
        bg="#fff"
        shadow={TABLE_SHADOW}
        rounded="10px"
      />
    );
  }

  if (isLoading) {
    content = (
      <Center
        w="full"
        py="24"
        h="400px"
        bg="#fff"
        shadow={TABLE_SHADOW}
        rounded="10px"
      >
        <Loader />
      </Center>
    );
  }

  return content;
}
