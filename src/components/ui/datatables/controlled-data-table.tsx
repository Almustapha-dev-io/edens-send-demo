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
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import Paginator from '../custom-paginator';
import ErrorPlaceholder from '../error-placeholder';
import { Loader } from '../loader';
import NoData from '../no-data';

type Props<T> = {
  data: T[];
  pageCount: number;
  totalItems: number;
  columns: ColumnDef<T>[];
  handleRowClick?(data: T): unknown;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  fetchData(p: PaginationState): void;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
} & Omit<TableContainerProps, 'children'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ControlledDataTable = forwardRef<{ resetPagination(): void }, Props<any>>(
  function (
    {
      columns,
      data,
      handleRowClick,
      isError,
      isLoading,
      isFetching,
      fetchData,
      pageCount,
      rowSelection,
      setRowSelection,
      enableRowSelection,
      title,
      totalItems,
      ...rest
    },
    ref
  ) {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    useImperativeHandle(ref, () => ({
      resetPagination() {
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
    }));

    const pagination = useMemo(
      () => ({
        pageIndex,
        pageSize,
      }),
      [pageIndex, pageSize]
    );

    const doFetch = useCallback(() => {
      fetchData({ pageIndex, pageSize });
    }, [fetchData, pageIndex, pageSize]);

    const table = useReactTable({
      data,
      columns,
      pageCount,
      state: { pagination, rowSelection },
      enableRowSelection,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      manualPagination: true,
      debugTable: import.meta.env.DEV,
    });

    const tableRef = useRef(table);
    tableRef.current = table;

    useEffect(() => {
      doFetch();
      tableRef.current.resetRowSelection();
    }, [doFetch]);

    let content = (
      <>
        <TableContainer
          w="full"
          bg="#fff"
          pb="40px"
          roundedBottom="12px"
          className="custom__scroll"
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
                      textTransform="capitalize"
                      pt="25px"
                      pb="21px"
                      bg="#F9F9F9"
                      borderWidth="0px"
                      fontSize="14px"
                      fontWeight="500"
                      letterSpacing="0.14px"
                      lineHeight="150%"
                      color="#180101"
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
                      color="#4B4B4B"
                      borderBottomColor="#E9E5E5"
                      py="6"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </ChakraTable>
        </TableContainer>
        <Box w="full" mt="40px">
          <Paginator
            page={pageIndex}
            pageSize={pageSize}
            totalPages={pageCount}
            totalItems={totalItems}
            setPage={table.setPageIndex}
            setPageSize={table.setPageSize}
            toFirstPage={() => table.setPageIndex(0)}
            toLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
            canNext={table.getCanNextPage()}
            canPrev={table.getCanPreviousPage()}
          />
        </Box>
      </>
    );

    if (!data.length) {
      content = (
        <NoData
          h="400px"
          py="24"
          label={isFetching ? '' : 'No Data'}
          retryHandler={doFetch}
          isLoading={isFetching}
          bg="#fff"
          roundedBottom="12px"
        />
      );
    }

    if (isError && !isLoading) {
      content = (
        <ErrorPlaceholder
          h="400px"
          py="24"
          retryHandler={doFetch}
          label={isFetching ? '' : undefined}
          isLoading={isFetching}
          bg="#fff"
          roundedBottom="12px"
        />
      );
    }

    if (isLoading) {
      content = (
        <Center w="full" py="24" h="400px" bg="#fff" roundedBottom="12px">
          <Loader />
        </Center>
      );
    }

    return content;
  }
);

ControlledDataTable.displayName = 'ControlledDataTable';

export default ControlledDataTable;
