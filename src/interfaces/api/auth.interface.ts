export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
