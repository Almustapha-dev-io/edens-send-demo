export const SEND_MONEY_ROUTE = '/money';
export const SEND_AIRTIME_ROUTE = '/airtime';
export const HISTORY_ROUTE = '/history';
export const TRANSACTION_DETAILS = (id: string) => `${HISTORY_ROUTE}/${id}`;
export const RESEND_TRANSACTION = (id: string) =>
  `${HISTORY_ROUTE}/${id}/resend`;
export const COMPLETE_LOGIN = '?complete-login=true';
export const COMPLETE_SIGNUP = '?complete-signup=true';
export const LOGIN = '?login=true';
export const VERIFY_ACCOUNT = '?verify-account=true';
export const SIGNUP = '?signup=true';
