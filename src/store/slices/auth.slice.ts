import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  AwsUserInfo,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyRequest,
  VerifyResponse,
} from '@interfaces/api/auth.interface';
import { Auth } from 'aws-amplify';
import { RootState } from '@store';
import { User } from '@interfaces/user.interface';

export interface AuthState {
  verificationDestination: string | null;
  verificationUsername: string | null;
  loading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  verificationDestination: null,
  verificationUsername: null,
  loading: false,
  user: null,
};

export const authStateSelector = (state: RootState) => state.auth;
export const userSelector = createSelector(
  authStateSelector,
  (state) => state.user,
);
export const loadingSelector = createSelector(
  authStateSelector,
  (state) => state.loading,
);

async function fetchUserWithTokens(): Promise<LoginResponse> {
  const session = await Auth.currentSession();
  const {
    attributes: { name, sub, email },
  }: AwsUserInfo = await Auth.currentUserInfo();

  return {
    id: sub,
    name,
    email,
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
}

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async ({ email, password }) => {
    await Auth.signIn(email, password);
    return fetchUserWithTokens();
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

export const fetchUserData = createAsyncThunk<LoginResponse>(
  'auth/fetchUserData',
  async () => {
    return fetchUserWithTokens();
  },
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setVerificationUsername(state, action: PayloadAction<string>) {
      state.verificationUsername = action.payload;
    },
    resetUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(signUp.fulfilled, (state, { payload }) => {
      state.verificationDestination = payload.verificationDestination;
      state.verificationUsername = payload.verificationUsername;
      state.loading = false;
    });

    builder.addCase(signUp.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.user = { ...payload };
      state.loading = false;
    });

    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(verifyAccount.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(verifyAccount.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(verifyAccount.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchUserData.fulfilled, (state, { payload }) => {
      state.user = { ...payload };
    });
  },
});

export const { setVerificationUsername, resetUser } = authSlice.actions;
export default authSlice.reducer;
