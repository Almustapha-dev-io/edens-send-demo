import { combineReducers } from '@reduxjs/toolkit';

import {
  apiReducer,
  apiReducerPath,
  authSlice,
  transactionParamsSlice,
} from './slices';

export const reducer = combineReducers({
  auth: authSlice.reducer,
  transactionParams: transactionParamsSlice.reducer,
  [apiReducerPath]: apiReducer,
});
