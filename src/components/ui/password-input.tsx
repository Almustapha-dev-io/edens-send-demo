import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import EyeCrossedIcon from '../icons/eye-crossed-icon';
import EyeIcon from '../icons/eye-icon';

type Props = Omit<InputProps, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ size, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <InputGroup size={size}>
        <Input type={isOpen ? 'text' : 'password'} {...props} ref={ref} />
        <InputRightElement>
          <IconButton
            aria-label={isOpen ? 'Hide Password' : 'Show Password'}
            variant="ghost"
            colorScheme="gray"
            _hover={{ bg: 'transparent' }}
            icon={isOpen ? <EyeCrossedIcon /> : <EyeIcon />}
            onClick={onToggle}
          />
        </InputRightElement>
      </InputGroup>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
