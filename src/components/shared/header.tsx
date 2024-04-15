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
                  Login/Signup
                </Button>
              </RouterLink>
              {/* <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton>
                      <HStack spacing="1">
                        <CircleUserIcon width="24px" height="24px" />
                        <ChevronDownIcon
                          style={{
                            transition: 'all 0.2s',
                            transform: isOpen
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                          }}
                        />
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        fontWeight="500"
                        onClick={() => {
                          navigate('?login=true');
                        }}
                      >
                        Log In
                      </MenuItem>
                      <MenuItem
                        fontWeight="500"
                        onClick={() => {
                          navigate('?signup=true');
                        }}
                      >
                        Create an account
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu> */}
            </Else>
          </If>
        </HStack>
      </HStack>
    </Box>
  );
}
