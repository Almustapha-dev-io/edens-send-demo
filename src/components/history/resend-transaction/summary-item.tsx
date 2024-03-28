import { Box, Heading, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  label: string;
  content: ReactNode;
};

export default function SummaryItem({ content, label }: Props) {
  return (
    <VStack
      className="summary__item"
      w="full"
      py="2"
      spacing="1"
      align="flex-start"
      _notLast={{ borderBottom: '1px solid #D7DBE7' }}
    >
      <Heading as="h5" color="#979797" fontWeight="400" fontSize="14px">
        {label}
      </Heading>
      <Box w="full" color="#000" fontWeight="400" fontSize="14px">
        {content}
      </Box>
    </VStack>
  );
}
