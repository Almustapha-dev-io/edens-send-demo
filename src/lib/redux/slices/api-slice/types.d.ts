/* eslint-disable @typescript-eslint/indent */
import {
  EndpointBuilder,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationActionCreatorResult,
  MutationDefinition,
  QueryActionCreatorResult,
} from '@reduxjs/toolkit/query';

export type TApiTag =
  | 'CREATE_SEND_TRANSACTION_PARAMS'
  | 'TRANSACTION'
  | 'TRANSACTIONS'
  | 'AIRTIME_PRODUCTS';

export type TAppEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  TApiTag,
  'api'
>;

export type TQueryActionCreatorResult = QueryActionCreatorResult<
  QueryDefinition<
    unknown,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    TApiTag,
    unknown,
    'api'
  >
>;

export type TMutationCreatorResult = MutationActionCreatorResult<
  MutationDefinition<
    unknown,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    TApiTag,
    unknown,
    'api'
  >
>;
