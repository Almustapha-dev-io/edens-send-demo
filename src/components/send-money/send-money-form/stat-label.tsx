import { Center, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: string;
  value: string;
};

export default function StatLabel({ icon, label, value }: Props) {
  return (
    <HStack w="full" justify="space-between" align="center" spacing="2">
      <HStack spacing="3">
        <Center rounded="full" flexShrink="0" bg="#C9CED8" w="16px" h="16px">
          {icon}
        </Center>
        <Text fontWeight="400" fontSize="14px">
          {label}
        </Text>
      </HStack>

      <Text fontWeight="700" fontSize="14px">
        {value}
      </Text>
    </HStack>
  );
}
