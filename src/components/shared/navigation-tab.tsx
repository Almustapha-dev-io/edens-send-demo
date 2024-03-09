import { HStack, Text } from '@chakra-ui/react';
import { ReactNode, SVGProps } from 'react';

import { NAV_ITEMS } from '@/constants';

import NavLink from '../ui/nav-link';

type NavItemProps = {
  url: string;
  label: string;
  icon: ({ width, height, color }: SVGProps<SVGSVGElement>) => ReactNode;
};

function NavItem({ label, url, ...props }: NavItemProps) {
  return (
    <NavLink
      to={url}
      color="#fff"
      bg="transparent"
      flex="1"
      _activeLink={{
        bg: '#16434C',
      }}
      _hover={{
        '&:not(.active)': {
          bg: 'primary.700',
        },
      }}
      transition="all .5s"
      rounded="100px"
      h="full"
    >
      <HStack
        w="full"
        h="full"
        p="10px"
        spacing={{ base: '4px', md: 2 }}
        justify="center"
      >
        {!!props.icon && (
          <props.icon
            width="14px"
            height="14px"
            color="#fff"
            style={{ flexShrink: 0 }}
          />
        )}
        <Text
          flexShrink="0"
          fontSize={{ base: '12px', md: '14px' }}
          fontWeight="400"
          lineHeight="18.9px"
        >
          {label}
        </Text>
      </HStack>
    </NavLink>
  );
}

export default function NavigationTab() {
  return (
    <HStack
      w={{ base: 'full', md: '390px' }}
      h="50px"
      bg="primary.500"
      rounded="100px"
      p="5px"
      spacing="1"
      mx="auto"
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.url}
          icon={item.icon}
          label={item.label}
          url={item.url}
        />
      ))}
    </HStack>
  );
}
