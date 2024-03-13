import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { handleServerError } from '@/lib/errors';
import { useCreateTransactionParamsMutation } from '@/lib/redux';

export function useCreateTransactionsParams({
  hideSuccessMsg = false,
  hideErrorMsg = false,
}: TQueryArgs = {}) {
  const [createTransactionsParamsMutation, params] =
    useCreateTransactionParamsMutation();

  useEffect(() => {
    if (params.isSuccess && !params.isLoading && !hideSuccessMsg) {
      toast('Transacation Parameters created!', { type: 'success' });
    }
  }, [hideSuccessMsg, params.isLoading, params.isSuccess]);

  useEffect(() => {
    if (!hideErrorMsg && !params.isLoading && params.isError && params.error) {
      handleServerError(params.error);
    }
  }, [hideErrorMsg, params.error, params.isError, params.isLoading]);

  return Object.freeze({
    createTransactionsParamsMutation,
    ...params,
  });
}
