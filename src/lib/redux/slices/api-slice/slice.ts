import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseUrl } from '@/lib/env';

import getBaseQueryWithLogout from '../../base-query';
import apiTagTypes from './api-tag-types';
import { getSendMoneyEndpoints } from './builders';

const apiSlice = createApi({
  baseQuery: getBaseQueryWithLogout(apiBaseUrl),
  tagTypes: apiTagTypes,
  endpoints: (build) => ({
    ...getSendMoneyEndpoints(build),
  }),
});

export const {
  reducer: apiReducer,
  reducerPath: apiReducerPath,
  middleware: apiMiddleware,
  useCreateTransactionParamsMutation,
  useVerifyBeneficiaryMutation,
} = apiSlice;
