import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@interfaces/api/auth.interface';
import { Auth } from 'aws-amplify';
import { CognitoUser, ISignUpResult } from 'amazon-cognito-identity-js';

export interface AuthState {}

const initialState: AuthState = {};

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async ({ email, password }) => {
    const resp: CognitoUser = await Auth.signIn(email, password);
    console.log(resp);
    return resp;
  },
);

export const signUp = createAsyncThunk<SignUpResponse, SignUpRequest>(
  'auth/login',
  async ({ email, name, password }) => {
    const resp: ISignUpResult = await Auth.signUp({
      username: email,
      password,
      attributes: { name },
    });
    console.log(resp);
    return resp.user;
  },
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
