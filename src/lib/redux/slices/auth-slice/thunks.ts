import axios, { AxiosResponse } from 'axios';

import { apiBaseUrl } from '@/lib/env';
import { getServerErrorMessage } from '@/lib/errors';

import { createAppAsyncThunk } from '../../create-async-thunk';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

type LoginResponse = {
  user: TUser;
  token: string;
};

export const login = createAppAsyncThunk(
  'auth/login',
  async (data: Record<'email' | 'password', string>, thunkApi) => {
    try {
      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post('/api/v1/eden_send/auth/login', data);

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);

export const resetPasswordRequest = createAppAsyncThunk(
  'auth/reset-password',
  async (email: string, thunkApi) => {
    try {
      const response: AxiosResponse<TServerResponse<{}>> =
        await axiosInstance.post('/admin/reset-password', { email });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);

export const validPasswordReset = createAppAsyncThunk(
  'auth/validate-password-reset',
  async (data: Record<'token' | 'password', string>, thunkApi) => {
    try {
      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post('/auth/validate-reset-password', data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);
