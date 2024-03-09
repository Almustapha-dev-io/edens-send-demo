import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import Receipt from './receipt';
import Update from './update';

const items = [
  {
    title: 'Update',
    content(transaction: TTransaction) {
      return <Update transaction={transaction} />;
    },
  },
  {
    title: 'Details',
    content(transaction: TTransaction) {
      return <Receipt transaction={transaction} />;
    },
  },
];

type Props = {
  transaction: TTransaction;
};

export default function TransactionDetailsSm({ transaction }: Props) {
  return (
    <Tabs size="md" variant="line" w="full">
      <TabList w="full">
        {items.map((it) => (
          <Tab
            key={it.title}
            w="full"
            flex="1"
            fontSize="14px"
            _selected={{
              fontWeight: 700,
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'primary.500',
            }}
          >
            {it.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels mt="10" p="0" w="full">
        {items.map((it) => (
          <TabPanel key={it.title} p="0">
            {it.content(transaction)}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
