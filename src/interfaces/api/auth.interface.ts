export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDataWithTokens {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  id: string;
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignUpResponse {
  verificationDestination: string;
  verificationUsername: string;
  isConfirmed: boolean;
}

export interface VerifyRequest {
  verificationCode: string;
}

export interface VerifyResponse {}

export interface AwsUserInfo {
  attributes: {
    email: string;
    email_verified: boolean;
    name: string;
    sub: string;
  };
  id: string;
  username: string;
}

export interface UpdateAttributesRequest {
  name?: string;
}

export interface UpdateAttributesResponse {
  name: string;
}
