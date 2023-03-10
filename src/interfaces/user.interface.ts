export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  avatar: string | null;
}
