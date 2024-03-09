import { Badge } from '@chakra-ui/react';

export default function TransactionType({ type }: { type: string }) {
  return (
    <Badge
      rounded="20px"
      py="5px"
      px="10px"
      bg="#F0F0F0"
      fontWeight="400"
      fontSize="12px"
      textTransform="capitalize"
    >
      {type}
    </Badge>
  );
}
