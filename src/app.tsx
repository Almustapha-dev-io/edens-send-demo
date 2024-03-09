import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { Suspensed } from './components/ui/suspensed';
import SendAirtimeContextProvider from './context/send-airtime';
import SendMoneyContextProvider from './context/send-money';
import RootLayout from './layouts/root-layout';
import Auth from './pages/auth';

const SendMoneyPage = lazy(() => import('@/pages/send-money'));
const SendAirtimePage = lazy(() => import('@/pages/send-airtime'));
const HistoryPage = lazy(() => import('@/pages/history'));
const PageNotFound = lazy(() => import('@/pages/page-not-found'));

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    }
  }, [pathname]);

  return (
    <RootLayout>
      <Routes>
        <Route
          path="/money/*"
          element={
            <SendMoneyContextProvider>
              <Suspensed w="full" flex="1">
                <SendMoneyPage />
              </Suspensed>
            </SendMoneyContextProvider>
          }
        />

        <Route
          path="/airtime/*"
          element={
            <SendAirtimeContextProvider>
              <Suspensed>
                <SendAirtimePage />
              </Suspensed>
            </SendAirtimeContextProvider>
          }
        />

        <Route
          path="/history/*"
          element={
            <Suspensed>
              <HistoryPage />
            </Suspensed>
          }
        />

        <Route
          path="/"
          element={<Navigate to={`/money${location.search}`} />}
        />

        <Route
          path="*"
          element={
            <Suspensed w="full" flex="1">
              <PageNotFound />
            </Suspensed>
          }
        />
      </Routes>
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    </RootLayout>
  );
}
