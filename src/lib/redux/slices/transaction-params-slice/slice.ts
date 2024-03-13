/* eslint-disable @typescript-eslint/indent */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TRecipientDetails as TSendAirtimeRecipientDetails } from '@/lib/validations/send-airtime';
import {
  TRecipientBank as TSendMoneyRecipientBank,
  TRecipientWallet as TSendMoneyRecipientWallet,
  TSenderDetails,
} from '@/lib/validations/send-money';

export type TTransactionParamsState = {
  sendMoney: {
    amount?: string | number;
    country: string;
    transactionParams?: TTtransactionParams;
    recipientDetails?:
      | {
          category: 'wallet';
          details: TSendMoneyRecipientWallet;
        }
      | {
          category: 'bank';
          details: TSendMoneyRecipientBank;
        };
    senderDetails?: TSenderDetails;
  };

  sendAirtime: {
    recipientDetails?: TSendAirtimeRecipientDetails;
    amount?: string | number;
    senderDetails?: TSenderDetails;
  };
};

const createTransactionsParamsSlice = (initialState: TTransactionParamsState) =>
  createSlice({
    name: 'transactionsParams',
    initialState,
    reducers: {
      setSendMoneyTransactionsParams(
        state,
        {
          payload,
        }: PayloadAction<
          | (TTtransactionParams & { amount: string | number; country: string })
          | undefined
        >
      ) {
        if (!payload) {
          state.sendMoney.transactionParams = payload;
          return;
        }

        const { amount, country, ...rest } = payload;
        state.sendMoney.transactionParams = rest;
        state.sendMoney.amount = amount;
        state.sendMoney.country = country;
      },

      resetSendMoney(state) {
        state.sendMoney = {
          country: '',
        };
      },
    },
  });

export const transactionParamsSlice = createTransactionsParamsSlice({
  sendAirtime: {},
  sendMoney: {
    country: '',
  },
});

export const { resetSendMoney, setSendMoneyTransactionsParams } =
  transactionParamsSlice.actions;
