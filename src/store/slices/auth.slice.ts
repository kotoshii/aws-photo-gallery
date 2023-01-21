import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  AwsUserInfo,
  LoginRequest,
  UserDataWithTokens,
  SignUpRequest,
  SignUpResponse,
  UpdateAttributesRequest,
  UpdateAttributesResponse,
  VerifyRequest,
  VerifyResponse,
  UpdatePasswordRequest,
} from '@interfaces/api/auth.interface';
import { Auth, DataStore } from 'aws-amplify';
import { RootState } from '@store';
import { User } from '@interfaces/user.interface';
import { CognitoUser } from 'amazon-cognito-identity-js';

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

async function fetchUserWithTokens(): Promise<UserDataWithTokens> {
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

export const login = createAsyncThunk<UserDataWithTokens, LoginRequest>(
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

export const fetchUserData = createAsyncThunk<UserDataWithTokens>(
  'auth/fetchUserData',
  async () => {
    return fetchUserWithTokens();
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await Auth.signOut();
});

export const updateUserAttributes = createAsyncThunk<
  UpdateAttributesResponse,
  UpdateAttributesRequest
>('auth/updateUserAttributes', async (attrs) => {
  const user: CognitoUser = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, attrs);
  const { attributes }: AwsUserInfo = await Auth.currentUserInfo();

  return attributes;
});

export const updatePassword = createAsyncThunk<unknown, UpdatePasswordRequest>(
  'auth/updatePassword',
  async ({ oldPassword, newPassword }) => {
    const user: CognitoUser = await Auth.currentAuthenticatedUser();
    await Auth.changePassword(user, oldPassword, newPassword);
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

    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(signOut.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateUserAttributes.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      updateUserAttributes.fulfilled,
      (state, { payload: { name } }) => {
        state.loading = false;
        (state.user as User).name = name;
      },
    );

    builder.addCase(updateUserAttributes.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setVerificationUsername, resetUser } = authSlice.actions;
export default authSlice.reducer;
