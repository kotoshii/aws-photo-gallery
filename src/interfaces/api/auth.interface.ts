import { CognitoUser } from 'amazon-cognito-identity-js';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends CognitoUser {}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignUpResponse extends CognitoUser {}
