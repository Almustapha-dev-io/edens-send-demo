/* eslint-disable @typescript-eslint/indent */
import { HttpMethods } from '@/constants';

import { TAppEndpointBuilder } from '../types';

type TTransactionsRes = Record<'transactions', TTransaction[]>;
type TTransactionRes = Record<'transaction', TTransaction>;
type TInitiateSendMoneyRes = Record<'reference', string>;

export const getTransactionsEndpoints = (builder: TAppEndpointBuilder) => ({
  getTransactions: builder.query<TServerResponse<TTransactionsRes>, void>({
    query: () => '/api/v1/eden_send/transactions',
    providesTags: ['TRANSACTIONS'],
    transformResponse: (res: TServerResponse<TTransactionsRes>) => res,
  }),

  getTransaction: builder.query<TServerResponse<TTransactionRes>, string>({
    query: (id) => `/api/v1/eden_send/transactions/${id}`,
    providesTags: ['TRANSACTION'],
    transformResponse: (res: TServerResponse<TTransactionRes>) => res,
  }),

  initiateSendMoney: builder.mutation<
    TServerResponse<TInitiateSendMoneyRes>,
    InitiateSendTransactionDTO
  >({
    query: (body) => ({
      url: '/api/v1/eden_send/transactions',
      method: HttpMethods.POST,
      body,
    }),
    invalidatesTags: ['TRANSACTION', 'TRANSACTIONS'],
    transformResponse: (res: TServerResponse<TInitiateSendMoneyRes>) => res,
  }),
});
