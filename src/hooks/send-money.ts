import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { handleServerError } from '@/lib/errors';
import {
  useAppSelector,
  useCheckEdensClientMutation,
  useCreateTransactionParamsMutation,
  useVerifyBeneficiaryMutation,
} from '@/lib/redux';

export function useCreateTransactionsParams({
  hideSuccessMsg = false,
  hideErrorMsg = false,
}: TQueryArgs = {}) {
  const [createTransactionsParamsMutation, params] =
    useCreateTransactionParamsMutation({
      fixedCacheKey: 'CREATE_TRANSACTION_PARAMS',
    });

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

export function useSendMoneySources() {
  const { transactionParams } = useAppSelector(
    (s) => s.transactionParams.sendMoney
  );

  const wallets = useMemo(() => {
    if (!transactionParams) return [];
    const walletsList = Object.entries(
      transactionParams.recipientInstitutions.WALLETS
    ).map((entry) => ({
      label: entry[1],
      value: entry[0],
    }));
    return walletsList;
  }, [transactionParams]);

  const banks = useMemo<TCustomSelectItem<string>[]>(() => {
    if (!transactionParams) return [];
    const banksList = Object.entries(
      transactionParams.recipientInstitutions.BANKS
    ).map((entry) => ({
      label: entry[1],
      value: entry[0],
    }));
    return banksList;
  }, [transactionParams]);

  return { wallets, banks } as const;
}

export function useVerifyBeneficiary({
  hideSuccessMsg = false,
  hideErrorMsg = false,
}: TQueryArgs = {}) {
  const [verifyBeneficiaryMutation, params] = useVerifyBeneficiaryMutation();

  useEffect(() => {
    if (params.isSuccess && !params.isLoading && !hideSuccessMsg) {
      toast(params.data.message, { type: 'success' });
    }
  }, [
    hideSuccessMsg,
    params.data?.message,
    params.isLoading,
    params.isSuccess,
  ]);

  useEffect(() => {
    if (!hideErrorMsg && !params.isLoading && params.isError && params.error) {
      handleServerError(params.error);
    }
  }, [hideErrorMsg, params.error, params.isError, params.isLoading]);

  return Object.freeze({
    verifyBeneficiaryMutation,
    ...params,
  });
}

export function useCheckEdensSendClient({
  hideSuccessMsg = false,
  hideErrorMsg = false,
}: TQueryArgs = {}) {
  const [checkClientMutation, params] = useCheckEdensClientMutation();

  useEffect(() => {
    if (params.isSuccess && !params.isLoading && !hideSuccessMsg) {
      toast(params.data.message, { type: 'success' });
    }
  }, [
    hideSuccessMsg,
    params.data?.message,
    params.isLoading,
    params.isSuccess,
  ]);

  useEffect(() => {
    if (!hideErrorMsg && !params.isLoading && params.isError && params.error) {
      handleServerError(params.error);
    }
  }, [hideErrorMsg, params.error, params.isError, params.isLoading]);

  return Object.freeze({
    checkClientMutation,
    ...params,
  });
}
