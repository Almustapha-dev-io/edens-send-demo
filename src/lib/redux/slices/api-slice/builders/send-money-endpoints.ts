/* eslint-disable @typescript-eslint/indent */
import { HttpMethods } from '@/constants';

import { TAppEndpointBuilder } from '../types';

export type TTransactionParamsRes = Record<
  'transactionParameters',
  TTtransactionParams
>;

type TVerifyBeneficiaryRes = {
  beneficiary_name: string;
  beneficiary_email: string;
};

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

  verifyBeneficiary: builder.mutation<
    TServerResponse<TVerifyBeneficiaryRes>,
    VerifyBeneficiaryDTO
  >({
    query: (body) => ({
      url: '/api/v1/eden_send/verify_beneficiary',
      method: HttpMethods.POST,
      body,
    }),
    transformResponse: (res: TServerResponse<TVerifyBeneficiaryRes>) => res,
    extraOptions: {
      ignoreLogout: true,
    },
  }),

  checkEdensClient: builder.mutation<
    TServerResponse<{}>,
    Record<'email', string>
  >({
    query: (body) => ({
      url: '/api/v1/eden_send/auth/check_sender',
      method: HttpMethods.POST,
      body,
    }),
    extraOptions: {
      ignoreLogout: true,
    },
  }),
});
