import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SendMoneyPageState } from '@/types/enums';

type TSendMoneyContext = {
  pageState: SendMoneyPageState;
  onNextPage(): void;
  onPrevioussPage(): void;
  resetPageState(): void;
};

const SendMoneyContext = createContext<TSendMoneyContext>({
  onNextPage() {},
  onPrevioussPage() {},
  resetPageState() {},
  pageState: SendMoneyPageState.FORM,
});

export const useSendMoneyContext = () => {
  const ctx = useContext(SendMoneyContext);

  if (!ctx) {
    throw new Error(
      "'useSendMoneyContext' must be used with SendMoneyContextProvider"
    );
  }

  return ctx;
};

export default function SendMoneyContextProvider({
  children,
}: PropsWithChildren) {
  const [curPage, setCurPage] = useState<SendMoneyPageState>(
    SendMoneyPageState.FORM
  );

  const onNextPage = useCallback(() => {
    setCurPage((cur) => {
      if (cur === SendMoneyPageState.FORM)
        return SendMoneyPageState.RECIPIENT_DETAILS;
      if (cur === SendMoneyPageState.RECIPIENT_DETAILS)
        return SendMoneyPageState.SENDER_DETAILS;
      if (cur === SendMoneyPageState.SENDER_DETAILS)
        return SendMoneyPageState.SUMMARY;
      return cur;
    });
  }, []);

  const onPrevioussPage = useCallback(() => {
    setCurPage((cur) => {
      if (cur === SendMoneyPageState.SUMMARY)
        return SendMoneyPageState.SENDER_DETAILS;
      if (cur === SendMoneyPageState.SENDER_DETAILS)
        return SendMoneyPageState.RECIPIENT_DETAILS;
      if (cur === SendMoneyPageState.RECIPIENT_DETAILS)
        return SendMoneyPageState.FORM;
      return cur;
    });
  }, []);

  const resetPageState = useCallback(() => {
    setCurPage(SendMoneyPageState.FORM);
  }, []);

  return (
    <SendMoneyContext.Provider
      value={{
        onNextPage,
        onPrevioussPage,
        resetPageState,
        pageState: curPage,
      }}
    >
      {children}
    </SendMoneyContext.Provider>
  );
}
