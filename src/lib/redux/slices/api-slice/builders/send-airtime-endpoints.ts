/* eslint-disable @typescript-eslint/indent */

import { TAppEndpointBuilder } from '../types';

type TGetAirtimeBillProvidersRes = Record<'billsproviders', TAirtimeCountry[]>;
type TGetAirtimeOperatorProductsRes = Record<
  'operatorProducts',
  TAirtimeBillProviderProduct[]
>;

export const getSendAirtimeEndpoints = (builder: TAppEndpointBuilder) => ({
  getAirtimeBillProviders: builder.query<
    TServerResponse<TGetAirtimeBillProvidersRes>,
    void
  >({
    query: () => '/api/v1/eden_send/airtime/operators',
    providesTags: ['AIRTIME_PRODUCTS'],
    transformResponse: (res: TServerResponse<TGetAirtimeBillProvidersRes>) =>
      res,
  }),

  getAirtimeOperatorProduct: builder.query<
    TServerResponse<TGetAirtimeOperatorProductsRes>,
    string
  >({
    query: (id) => `/api/v1/eden_send/airtime/operators/${id}`,
    providesTags: ['AIRTIME_PRODUCTS'],
    transformResponse: (res: TServerResponse<TGetAirtimeOperatorProductsRes>) =>
      res,
  }),
});
