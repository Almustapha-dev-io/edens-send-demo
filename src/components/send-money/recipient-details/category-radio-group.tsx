import {
  Box,
  Center,
  HStack,
  Text,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import BankIcon from '@/components/icons/bank-icon';
import WalletIcon from '@/components/icons/wallet-icon';

type TCategoryRadio = {
  label: string;
  icon: ReactNode;
  value: 'wallet' | 'bank';
};

const RADIO_OPTIONS: TCategoryRadio[] = [
  {
    icon: <WalletIcon />,
    label: 'Wallet',
    value: 'wallet',
  },
  {
    icon: <BankIcon />,
    label: 'Bank',
    value: 'bank',
  },
];

type CategoryRadioProps = UseRadioProps & Omit<TCategoryRadio, 'value'>;

function CategoryRadio({ icon, label, ...props }: CategoryRadioProps) {
  const { getInputProps, getRadioProps, state } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" flex="1" w="full" h="full">
      <input {...input} />
      <HStack
        spacing="3"
        w="full"
        h="full"
        cursor="pointer"
        rounded="10px"
        border="1px solid #EFEFEF"
        p="15px"
        transition="all 0.2s"
        _checked={{
          border: '1px solid #92CCBF',
          bg: '#EEFFFB',
        }}
        {...checkbox}
      >
        <Center
          w="11px"
          h="11px"
          flexShrink="0"
          borderWidth="1px"
          borderStyle="solid"
          borderColor={state.isChecked ? '#92CCBF' : '#C5C5C5'}
          rounded="full"
          p="1px"
          transition="all 0.2s"
        >
          <Box
            w="full"
            h="full"
            rounded="full"
            flexShrink="0"
            bg={state.isChecked ? '#92CCBF' : '#fff'}
            transition="all 0.2s"
          />
        </Center>
        {icon}
        <Text fontWeight="400" fontSize="14px">
          {label}
        </Text>
      </HStack>
    </Box>
  );
}

type Props = {
  value: 'wallet' | 'bank';
  onChange(value: 'wallet' | 'bank'): void;
};

export default function CategoryRadioGroup({ onChange, value }: Props) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: 'wallet',
    value,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack w="full" spacing={{ base: 2, md: '21px' }} {...group}>
      {RADIO_OPTIONS.map((opt) => {
        const radio = getRadioProps({ value: opt.value });

        return (
          <CategoryRadio
            key={opt.value}
            label={opt.label}
            icon={opt.icon}
            {...radio}
          />
        );
      })}
    </HStack>
  );
}
