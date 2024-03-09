/* eslint-disable @typescript-eslint/indent */
import { Button, ButtonProps, Center } from '@chakra-ui/react';

import ArrowLeftSmIcon from '../icons/arrow-left-sm-icon';

type Props = Omit<ButtonProps, 'children'>;

export default function BackButton(props: Props) {
  return (
    <Button
      display="flex"
      align="center"
      variant="unstyled"
      fontWeight="400"
      fontSize="14px"
      leftIcon={
        <Center w="22px" h="22px" rounded="full" bg="#C9CED8">
          <ArrowLeftSmIcon />
        </Center>
      }
      {...props}
    >
      Back
    </Button>
  );
}
