import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { handleServerError } from '@/lib/errors';
import {
  useAppSelector,
  useResendAccountVerificationMutation,
} from '@/lib/redux';

export function useUser() {
  return useAppSelector((s) => s.auth.userDetails);
}

export function useToken() {
  return useAppSelector((s) => s.auth.accessToken);
}

export function useIsAuthenticated() {
  const { userDetails, accessToken } = useAppSelector((s) => s.auth);
  if (!userDetails || !accessToken || !userDetails.email_verified) return false;

  return true;
}

export function useResendAccountVerification({
  hideSuccessMsg = false,
  hideErrorMsg = false,
}: TQueryArgs = {}) {
  const [resendAccountVerificationMutation, params] =
    useResendAccountVerificationMutation();

  useEffect(() => {
    if (params.isSuccess && !params.isLoading && !hideSuccessMsg) {
      toast('Verification OTP resent', {
        type: 'success',
        position: 'bottom-center',
      });
    }
  }, [hideSuccessMsg, params.isLoading, params.isSuccess]);

  useEffect(() => {
    if (!hideErrorMsg && !params.isLoading && params.isError && params.error) {
      handleServerError(params.error);
    }
  }, [hideErrorMsg, params.error, params.isError, params.isLoading]);

  return Object.freeze({
    resendAccountVerificationMutation,
    ...params,
  });
}
