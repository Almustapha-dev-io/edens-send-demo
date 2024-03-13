/* eslint-disable @typescript-eslint/indent */
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import { edensClientId } from '../env';
import { signOut } from '.';
import { RootState } from './store';

const getBaseQueryWithLogout = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
      const state = getState() as RootState;

      headers.set('x-client-id', edensClientId);
      if (state.auth && state.auth.accessToken) {
        headers.set('Authorization', `Bearer ${state.auth.accessToken}`);
      }
      return headers;
    },
  });

  const baseQueryWithLogout: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const ignoreLogout =
      'ignoreLogout' in extraOptions &&
      typeof extraOptions.ignoreLogout === 'boolean' &&
      extraOptions.ignoreLogout;

    if (result.error && result.error.status === 401 && !ignoreLogout) {
      toast('Your session expired!', {
        type: 'error',
        toastId: 'session-expired',
      });
      api.dispatch(signOut());
    }
    return result;
  };

  return baseQueryWithLogout;
};

export default getBaseQueryWithLogout;
