/* eslint-disable @typescript-eslint/indent */

/* Core */
import {
  type Action,
  configureStore,
  type ThunkAction,
} from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createFilter } from 'redux-persist-transform-filter';

import { middleware } from './middleware';
/* Instruments */
import { reducer } from './root-reducer';

function configureStoreWithMiddleware(initialState = {}) {
  const loadSubsetFilter = createFilter('auth', ['userDetails', 'accessToken']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootPersistConfig: any = {
    key: 'root',
    storage,
    whitelist: ['auth'],
    transforms: [loadSubsetFilter],
  };

  const persistedReducer = persistReducer(rootPersistConfig, reducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (gDM) =>
      gDM({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middleware),
    devTools: import.meta.env.DEV,
    preloadedState: initialState,
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

export const { persistor, store } = configureStoreWithMiddleware();
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

/* Types */
export type ReduxStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
