import { useBreakpointValue } from '@chakra-ui/react';

import TransactionsTableLg from './transactions-table-lg';
import TransactionsTableSm from './transactions-table-sm';

type Props = {
  transactions: TTransaction[];
  isLoading?: boolean;
  isError?: boolean;
  refetch?(): void;
};

export default function TransactionsTable(props: Props) {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  if (isSmallScreen) return <TransactionsTableSm {...props} />;
  return <TransactionsTableLg {...props} />;
}
