import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Case, Switch } from 'react-if';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import CompleteLogin from '@/components/auth/complete-login';
import CompleteSignup from '@/components/auth/complete-signup';
import CreatePassword from '@/components/auth/create-password';
import ForgotPassword from '@/components/auth/forgot-password';
import ForgotPasswordVerify from '@/components/auth/forgot-password-verify';
import Login from '@/components/auth/login';
import PasswordSuccess from '@/components/auth/password-success';
import VerifyAccount from '@/components/auth/verify-account';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isPageOpen = (url: string) => !!searchParams.get(url);

  const onClose = () => {
    navigate(pathname, { replace: true });
  };

  return (
    <Modal
      size="md"
      isOpen={
        isPageOpen('login') ||
        isPageOpen('forgot-password') ||
        isPageOpen('forgot-password-verify') ||
        isPageOpen('create-password') ||
        isPageOpen('verify-account') ||
        isPageOpen('password-success') ||
        isPageOpen('complete-login') ||
        isPageOpen('complete-signup')
      }
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
          </Switch>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
