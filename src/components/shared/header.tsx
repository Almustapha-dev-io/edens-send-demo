import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Else, If, Then } from 'react-if';

import { useIsAuthenticated, useUser } from '@/hooks';
import { signOut, useAppDispatch } from '@/lib/redux';

import CircleUserIcon from '../icons/circle-user-icon';
import RouterLink from '../ui/router-link';
import NavigationTab from './navigation-tab';

export default function Header() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const isAuth = useIsAuthenticated();
  const user = useUser();

  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(signOut());
  };

  return (
    <Box
      as="header"
      w="full"
      pos="fixed"
      top="0"
      zIndex="11"
      bg={{ base: '#fff', md: '#F4FAF9' }}
    >
      <HStack
        w="full"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py="5"
        justify="space-between"
        align="center"
      >
        <RouterLink to="/money">
          <Image
            src="/assets/images/logo-full.svg"
            maxH={{ base: '26px', md: '35.36px' }}
          />
        </RouterLink>

        <HStack align="center" spacing="16px">
          {isLargeScreen && <NavigationTab />}

          <If condition={isAuth}>
            <Then>
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={`${user?.first_name} ${user?.last_name}`}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem color="red.500" onClick={logoutHandler}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Then>
            <Else>
              <RouterLink to="?login=true">
                <Button size="md" variant="link" leftIcon={<CircleUserIcon />}>
                  Login
                </Button>
              </RouterLink>
            </Else>
          </If>
        </HStack>
      </HStack>
    </Box>
  );
}
