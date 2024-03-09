/* eslint-disable @typescript-eslint/indent */
import { chakra, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import {
  Link as RouterDomLink,
  LinkProps as RouterDomLinkProps,
} from 'react-router-dom';

const ForwarededRouterDomLink = chakra(RouterDomLink, {
  shouldForwardProp: () => true,
});

type Props = Omit<RouterDomLinkProps, 'to'> &
  Required<Pick<RouterDomLinkProps, 'to'>> &
  Omit<ChakraLinkProps, 'href'>;

export default function RouterLink({ to, children, ...props }: Props) {
  return (
    <ForwarededRouterDomLink to={to} {...props}>
      {children}
    </ForwarededRouterDomLink>
  );
}
