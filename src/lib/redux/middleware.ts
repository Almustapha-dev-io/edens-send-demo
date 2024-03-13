/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { apiMiddleware } from './slices';

const middleware = [
  createLogger({
    duration: true,
    timestamp: false,
    collapsed: true,
    colors: {
      title: () => '#139BFE',
      prevState: () => '#1C5FAF',
      action: () => '#149945',
      nextState: () => '#A47104',
      error: () => '#ff0005',
    },
    predicate: () => typeof window !== 'undefined' && import.meta.env.DEV,
  }) as Middleware<{}, any, Dispatch<any>>,
  apiMiddleware,
];

export { middleware };
