import 'react-toastify/dist/ReactToastify.css';
import '@/index.scss';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import App from '@/app';
import ErrorBoundaryFallback from '@/components/ui/error-boundary-fallback';
import chakraTheme from '@/lib/chakra-theme';

import { persistor, store } from './lib/redux';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/*"
      element={<App />}
      errorElement={<ErrorBoundaryFallback />}
    />
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={chakraTheme}>
          <ToastContainer
            position="top-right"
            autoClose={7000}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            bodyClassName="__toastify"
            theme="light"
          />
          <RouterProvider router={router} />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
