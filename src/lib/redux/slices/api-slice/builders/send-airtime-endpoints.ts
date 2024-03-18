/* eslint-disable @typescript-eslint/indent */

import { TAppEndpointBuilder } from '../types';

type TGetAirtimeBillProvidersRes = Record<'billsproviders', TAirtimeCountry[]>;

export const getSendAirtimeEndpoints = (builder: TAppEndpointBuilder) => ({
  getAirtimeBillProviders: builder.query<
    TServerResponse<TGetAirtimeBillProvidersRes>,
    void
  >({
    query: () => '/api/v1/eden_send/airtime/products',
    providesTags: ['AIRTIME_PRODUCTS'],
    transformResponse: (res: TServerResponse<TGetAirtimeBillProvidersRes>) =>
      res,
  }),
});
