import { useAppSelector } from '@/lib/redux';

export function useUser() {
  return useAppSelector((s) => s.auth.userDetails);
}

export function useToken() {
  return useAppSelector((s) => s.auth.accessToken);
}

export function useIsAuthenticated() {
  const { userDetails, accessToken } = useAppSelector((s) => s.auth);
  if (!userDetails || !accessToken || !userDetails.email_verified) return false;

  return true;
}
