import 'react-toastify/dist/ReactToastify.css';
import '@/index.scss';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from '@/app';
import ErrorBoundaryFallback from '@/components/ui/error-boundary-fallback';
import chakraTheme from '@/lib/chakra-theme';

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
  </React.StrictMode>
);
