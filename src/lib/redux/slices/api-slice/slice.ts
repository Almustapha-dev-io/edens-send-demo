import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseUrl } from '@/lib/env';

import getBaseQueryWithLogout from '../../base-query';
import apiTagTypes from './api-tag-types';
import {
  getProfileEndpoints,
  getSendAirtimeEndpoints,
  getSendMoneyEndpoints,
  getTransactionsEndpoints,
} from './builders';

const apiSlice = createApi({
  baseQuery: getBaseQueryWithLogout(apiBaseUrl),
  tagTypes: apiTagTypes,
  endpoints: (build) => ({
    ...getSendMoneyEndpoints(build),
    ...getTransactionsEndpoints(build),
    ...getSendAirtimeEndpoints(build),
    ...getProfileEndpoints(build),
  }),
});

export const {
  reducer: apiReducer,
  reducerPath: apiReducerPath,
  middleware: apiMiddleware,
  useCreateTransactionParamsMutation,
  useVerifyBeneficiaryMutation,
  useCheckEdensClientMutation,
  useGetTransactionQuery,
  useGetTransactionsQuery,
  useLazyGetTransactionQuery,
  useLazyGetTransactionsQuery,
  useInitiateSendMoneyMutation,
  useGetAirtimeBillProvidersQuery,
  useLazyGetAirtimeBillProvidersQuery,
  useInitiateAirtimeTransactionMutation,
  useRetryTransactionsMutation,
  useGetAirtimeOperatorProductQuery,
  useLazyGetAirtimeOperatorProductQuery,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = apiSlice;
