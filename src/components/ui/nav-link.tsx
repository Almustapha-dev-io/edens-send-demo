/* eslint-disable @typescript-eslint/indent */
import { chakra, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import {
  NavLink as RouterDomNavLink,
  NavLinkProps as RouterDomNavLinkProps,
} from 'react-router-dom';

const ForwarededRouterDomNavLink = chakra(RouterDomNavLink, {
  shouldForwardProp: () => true,
});

type Props = Omit<RouterDomNavLinkProps, 'to'> &
  Required<Pick<RouterDomNavLinkProps, 'to'>> &
  Omit<ChakraLinkProps, 'href'>;

export default function NavLink({ to, children, ...props }: Props) {
  return (
    <ForwarededRouterDomNavLink to={to} {...props}>
      {children}
    </ForwarededRouterDomNavLink>
  );
}
