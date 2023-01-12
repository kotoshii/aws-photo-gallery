import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyRequest,
  VerifyResponse,
} from '@interfaces/api/auth.interface';
import { Auth } from 'aws-amplify';
import { RootState } from '@store';

export interface AuthState {
  verificationDestination: string | null;
  verificationUsername: string | null;
  loading: boolean;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const initialState: AuthState = {
  verificationDestination: null,
  verificationUsername: null,
  loading: false,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
};

// export const authStateSelector = (state: RootState) => state.auth;

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async ({ email, password }) => {
    await Auth.signIn(email, password);
    const session = await Auth.currentSession();

    return {
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
    };
  },
);

export const signUp = createAsyncThunk<SignUpResponse, SignUpRequest>(
  'auth/signUp',
  async ({ email, name, password }) => {
    const { user, userConfirmed } = await Auth.signUp({
      username: email,
      password,
      attributes: { name },
    });

    return {
      verificationDestination: email,
      verificationUsername: user.getUsername(),
      isConfirmed: userConfirmed,
    };
  },
);

export const verifyAccount = createAsyncThunk<
  VerifyResponse,
  VerifyRequest,
  { state: RootState }
>('auth/verifyAccount', async ({ verificationCode }, { getState }) => {
  await Auth.confirmSignUp(
    getState().auth.verificationUsername as string,
    verificationCode,
  );
});

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setVerificationUsername(state, action: PayloadAction<string>) {
      state.verificationUsername = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, { payload }) => {
      state.verificationDestination = payload.verificationDestination;
      state.verificationUsername = payload.verificationUsername;
    });

    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.tokens.accessToken = payload.accessToken;
      state.tokens.refreshToken = payload.refreshToken;
    });
  },
});

export const { setVerificationUsername } = authSlice.actions;
export default authSlice.reducer;
