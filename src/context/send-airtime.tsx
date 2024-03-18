import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SendAirtimePageState } from '@/types/enums';

type TSendAirtimeContext = {
  pageState: SendAirtimePageState;
  onNextPage(): void;
  onPreviousPage(): void;
  resetPageState(): void;
  setPage(page: SendAirtimePageState): void;
};

const SendAirtimeContext = createContext<TSendAirtimeContext>({
  onNextPage() {},
  onPreviousPage() {},
  resetPageState() {},
  setPage() {},
  pageState: SendAirtimePageState.RECIPIENT_DETAILS,
});

export const useSendAirtimeContext = () => {
  const ctx = useContext(SendAirtimeContext);

  if (!ctx) {
    throw new Error(
      "'useSendAirtimeContext' must be used with SendAirtimeContextProvider"
    );
  }

  return ctx;
};

export default function SendAirtimeContextProvider({
  children,
}: PropsWithChildren) {
  const [curPage, setCurPage] = useState<SendAirtimePageState>(
    SendAirtimePageState.RECIPIENT_DETAILS
  );

  const setPage = useCallback((p: SendAirtimePageState) => {
    setCurPage(p);
  }, []);

  const onNextPage = useCallback(() => {
    setCurPage((cur) => {
      if (cur === SendAirtimePageState.RECIPIENT_DETAILS)
        return SendAirtimePageState.AMOUNT_FORM;
      if (cur === SendAirtimePageState.AMOUNT_FORM)
        return SendAirtimePageState.SENDER_DETAILS;
      if (cur === SendAirtimePageState.SENDER_DETAILS)
        return SendAirtimePageState.SUMMARY;
      return cur;
    });
  }, []);

  const onPreviousPage = useCallback(() => {
    setCurPage((cur) => {
      if (cur === SendAirtimePageState.SUMMARY)
        return SendAirtimePageState.SENDER_DETAILS;
      if (cur === SendAirtimePageState.SENDER_DETAILS)
        return SendAirtimePageState.AMOUNT_FORM;
      if (cur === SendAirtimePageState.AMOUNT_FORM)
        return SendAirtimePageState.RECIPIENT_DETAILS;
      return cur;
    });
  }, []);

  const resetPageState = useCallback(() => {
    setCurPage(SendAirtimePageState.RECIPIENT_DETAILS);
  }, []);

  return (
    <SendAirtimeContext.Provider
      value={{
        onNextPage,
        onPreviousPage,
        resetPageState,
        setPage,
        pageState: curPage,
      }}
    >
      {children}
    </SendAirtimeContext.Provider>
  );
}
