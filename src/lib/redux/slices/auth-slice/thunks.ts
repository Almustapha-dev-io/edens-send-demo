import axios, { AxiosResponse } from 'axios';

import { apiBaseUrl, edensClientId } from '@/lib/env';
import { getServerErrorMessage } from '@/lib/errors';

import { createAppAsyncThunk } from '../../create-async-thunk';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

type LoginResponse = {
  edenSendClient: TUser;
  token: string;
};

type SignupDTO = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
};

export const login = createAppAsyncThunk(
  'auth/login',
  async (data: Record<'email' | 'password', string>, thunkApi) => {
    try {
      const headers: Record<string, string> = {
        'x-client-id': edensClientId,
      };

      const token = thunkApi.getState().auth.accessToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post('/api/v1/eden_send/auth/login', data, {
          headers,
        });

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);

export const signup = createAppAsyncThunk(
  'auth/signup',
  async (data: SignupDTO, thunkApi) => {
    try {
      const headers: Record<string, string> = {
        'x-client-id': edensClientId,
      };

      const token = thunkApi.getState().auth.accessToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post('/api/v1/eden_send/auth/signup', data, {
          headers,
        });

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);

export const verifyAccount = createAppAsyncThunk(
  'auth/verify-account',
  async (data: string, thunkApi) => {
    try {
      const headers: Record<string, string> = {
        'x-client-id': edensClientId,
      };

      const token = thunkApi.getState().auth.accessToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post(
          '/api/v1/eden_send/auth/verify',
          { token: data },
          {
            headers,
          }
        );
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
      const headers: Record<string, string> = {
        'x-client-id': edensClientId,
      };

      const token = thunkApi.getState().auth.accessToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response: AxiosResponse<TServerResponse<{}>> =
        await axiosInstance.post(
          '/admin/reset-password',
          { email },
          { headers }
        );
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
      const headers: Record<string, string> = {
        'x-client-id': edensClientId,
      };

      const token = thunkApi.getState().auth.accessToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response: AxiosResponse<TServerResponse<LoginResponse>> =
        await axiosInstance.post('/auth/validate-reset-password', data, {
          headers,
        });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getServerErrorMessage(error));
    }
  }
);
