import {
  Avatar,
  HStack,
  Input,
  InputProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

type Props = InputProps & {
  isLoading?: boolean;
};

const AsyncValidatorInput = forwardRef<HTMLInputElement, Props>(
  ({ isLoading, ...props }, ref) => {
    return (
      <VStack w="full" spacing="4">
        <Input size="lg" ref={ref} {...props} />
        <HStack w="full" bg="#F4F4F4" rounded="8px" p="10px" spacing="10px">
          <Avatar name="John Doe" w="36px" h="36px" />
          <Text fontWeight="400" fontSize="14px">
            John Doe
          </Text>
        </HStack>
      </VStack>
    );
  }
);

AsyncValidatorInput.displayName = 'AsyncValidatorInput';

export default AsyncValidatorInput;
