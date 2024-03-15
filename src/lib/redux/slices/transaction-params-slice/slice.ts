/* eslint-disable @typescript-eslint/indent */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TRecipientDetails as TSendAirtimeRecipientDetails } from '@/lib/validations/send-airtime';
import {
  TRecipientBank as TSendMoneyRecipientBank,
  TRecipientWallet as TSendMoneyRecipientWallet,
  TSecureTransferSchema,
  TSenderDetails,
} from '@/lib/validations/send-money';

type TSendMoneyRecipientDetails =
  | {
      category: 'wallet';
      details: TSendMoneyRecipientWallet;
    }
  | {
      category: 'bank';
      details: TSendMoneyRecipientBank;
    };

export type TTransactionParamsState = {
  sendMoney: {
    amount?: string | number;
    country: string;
    transactionParams?: TTtransactionParams;
    recipientDetails?: TSendMoneyRecipientDetails;
    senderDetails?: TSenderDetails;
    secureTransferDetails?: TSecureTransferSchema;
    recipientName?: string;
    recipientEmail?: string;
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

      setSendMoneyRecipientDetails(
        state,
        { payload }: PayloadAction<TSendMoneyRecipientDetails | undefined>
      ) {
        state.sendMoney.recipientDetails = payload;
      },

      setRecipientName(state, { payload }: PayloadAction<string>) {
        state.sendMoney.recipientName = payload;
      },

      setRecipientEmail(state, { payload }: PayloadAction<string>) {
        state.sendMoney.recipientEmail = payload;
      },

      setSenderDetails(
        state,
        { payload }: PayloadAction<TSenderDetails | undefined>
      ) {
        state.sendMoney.senderDetails = payload;
      },

      setSecureTransferDetails(
        state,
        { payload }: PayloadAction<TSecureTransferSchema | undefined>
      ) {
        state.sendMoney.secureTransferDetails = payload;
      },

      resetSendMoney(state, { payload }: PayloadAction<string | undefined>) {
        if (payload === 'amount') {
          delete state.sendMoney.amount;
          return;
        }

        if (payload === 'recipientName') {
          delete state.sendMoney.recipientName;
          return;
        }

        if (payload === 'recipientEmail') {
          delete state.sendMoney.recipientEmail;
          return;
        }

        if (payload === 'country') {
          state.sendMoney.country = 'LR';
          return;
        }

        if (payload === 'transactionParams') {
          delete state.sendMoney.transactionParams;
          return;
        }

        if (payload === 'recipientDetails') {
          delete state.sendMoney.recipientDetails;
          return;
        }

        if (payload === 'senderDetails') {
          delete state.sendMoney.senderDetails;
          return;
        }

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

export const {
  resetSendMoney,
  setSendMoneyTransactionsParams,
  setSendMoneyRecipientDetails,
  setRecipientName,
  setSenderDetails,
  setRecipientEmail,
  setSecureTransferDetails,
} = transactionParamsSlice.actions;
