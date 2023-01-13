import { userSelector } from '@store/slices/auth.slice';
import { useSelector } from 'react-redux';

export function useIsAuthenticated() {
  const user = useSelector(userSelector);
  return !!user;
}
