import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { login, resetPasswordRequest, validPasswordReset } from './thunks';

export type TAuthState = {
  userDetails?: TUser;
  accessToken?: string;
  status: 'idle' | 'pending';
  error?: string;
  successMsg?: string;
  resetRequestSuccess?: boolean;
  passwordResetSuccess?: boolean;
};

const createAuthSlice = (initialState: TAuthState) =>
  createSlice({
    name: 'auth',
    initialState,
    reducers: {
      startTask(state) {
        state.status = 'pending';
      },

      endTask(state) {
        state.status = 'idle';
      },

      onError(state, { payload }: PayloadAction<string>) {
        state.error = payload;
      },
      clearError(state) {
        state.error = '';
      },
      signOut(state) {
        delete state.accessToken;
        delete state.userDetails;
        state.error = '';
        state.status = 'idle';
      },
      setUser(state, { payload }: PayloadAction<TUser>) {
        state.userDetails = payload;
      },
      setResetStatus(state, { payload }: PayloadAction<boolean>) {
        state.resetRequestSuccess = payload;
      },
      initAuth(
        state,
        { payload }: PayloadAction<{ user: TUser; token: string } | undefined>
      ) {
        state.accessToken = payload?.token;
        state.userDetails = payload?.user;
      },
      clearPasswordResetSuccess(state) {
        delete state.resetRequestSuccess;
      },
    },
    extraReducers: (builder) => {
      // Login cases
      builder.addCase(login.pending, (state) => {
        state.status = 'pending';
        state.error = '';
      });

      builder.addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.error = '';
        state.accessToken = payload.token;
        state.userDetails = payload.user;
        delete state.successMsg;
        delete state.passwordResetSuccess;
      });

      builder.addCase(login.rejected, (state, { payload }) => {
        state.status = 'idle';
        state.error = payload;
        delete state.successMsg;
      });

      // Password reset cases
      builder.addCase(resetPasswordRequest.pending, (state) => {
        state.status = 'pending';
        state.error = '';
      });

      builder.addCase(resetPasswordRequest.fulfilled, (state) => {
        state.status = 'idle';
        state.error = '';
        state.resetRequestSuccess = true;
      });

      builder.addCase(resetPasswordRequest.rejected, (state, { payload }) => {
        state.status = 'idle';
        state.error = payload;
        state.resetRequestSuccess = false;
        delete state.successMsg;
      });

      // Validate password reset cases
      builder.addCase(validPasswordReset.pending, (state) => {
        state.status = 'pending';
        state.error = '';
      });

      builder.addCase(validPasswordReset.fulfilled, (state) => {
        state.status = 'idle';
        state.error = '';
        state.passwordResetSuccess = true;
        state.resetRequestSuccess = false;
        state.successMsg = 'Password reset successful. Please login.';
      });

      builder.addCase(validPasswordReset.rejected, (state, { payload }) => {
        state.status = 'idle';
        state.error = payload;
        state.passwordResetSuccess = false;
        delete state.successMsg;
      });
    },
  });

export const authSlice = createAuthSlice({
  error: '',
  status: 'idle',
});

export const {
  clearError,
  endTask,
  onError,
  setUser,
  signOut,
  startTask,
  setResetStatus,
  initAuth,
  clearPasswordResetSuccess,
} = authSlice.actions;
