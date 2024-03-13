/* eslint-disable @typescript-eslint/indent */
import { HttpMethods } from '@/constants';

import { TAppEndpointBuilder } from '../types';

type TTransactionParamsRes = Record<
  'transactionParameters',
  TTtransactionParams
>;

export const getSendMoneyEndpoints = (builder: TAppEndpointBuilder) => ({
  createTransactionParams: builder.mutation<
    TServerResponse<TTransactionParamsRes>,
    CreateTransactionParamsDTO
  >({
    query: (body) => ({
      url: '/api/v1/eden_send/transaction_parameters',
      method: HttpMethods.POST,
      body,
    }),
    transformResponse: (res: TServerResponse<TTransactionParamsRes>) => res,
    extraOptions: {
      ignoreLogout: true,
    },
  }),
});
