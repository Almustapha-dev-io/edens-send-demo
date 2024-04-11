import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { Case, Switch } from 'react-if';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import CompleteLogin from '@/components/auth/complete-login';
import CompleteSignup from '@/components/auth/complete-signup';
import CreatePassword from '@/components/auth/create-password';
import ForgotPassword from '@/components/auth/forgot-password';
import ForgotPasswordVerify from '@/components/auth/forgot-password-verify';
import Login from '@/components/auth/login';
import PasswordSuccess from '@/components/auth/password-success';
import Signup from '@/components/auth/signup';
import VerifyAccount from '@/components/auth/verify-account';
import { useIsAuthenticated } from '@/hooks';

const routeParams = [
  'login',
  'forgot-password',
  'forgot-password-verify',
  'create-password',
  'verify-account',
  'password-success',
  'complete-login',
  'complete-signup',
  'signup',
];

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuth = useIsAuthenticated();

  const isPageOpen = useCallback(
    (url: string) => !!searchParams.get(url),
    [searchParams]
  );

  const onClose = () => {
    navigate(pathname, { replace: true });
  };

  useEffect(() => {
    if (isAuth && routeParams.some(isPageOpen)) {
      routeParams.forEach((r) => searchParams.delete(r));
      setSearchParams(searchParams);
    }
  }, [isAuth, isPageOpen, searchParams, setSearchParams]);

  return (
    <Modal
      size={isPageOpen('signup') ? { base: 'full', md: 'md' } : 'md'}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={routeParams.some(isPageOpen)}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody px={{ base: '4', md: '30px' }} py="40px">
          <Switch>
            <Case condition={isPageOpen('login')}>
              <Login onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('forgot-password')}>
              <ForgotPassword onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('forgot-password-verify')}>
              <ForgotPasswordVerify onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('create-password')}>
              <CreatePassword onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('verify-account')}>
              <VerifyAccount onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('password-success')}>
              <PasswordSuccess />
            </Case>

            <Case condition={isPageOpen('complete-login')}>
              <CompleteLogin onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('complete-signup')}>
              <CompleteSignup onClose={onClose} />
            </Case>

            <Case condition={isPageOpen('signup')}>
              <Signup onClose={onClose} />
            </Case>
          </Switch>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
