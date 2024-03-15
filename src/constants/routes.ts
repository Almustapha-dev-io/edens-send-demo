export const SEND_MONEY_ROUTE = '/money';
export const SEND_AIRTIME_ROUTE = '/airtime';
export const HISTORY_ROUTE = '/history';
export const TRANSACTION_DETAILS = (id: string) => `${HISTORY_ROUTE}/${id}`;
export const COMPLETE_LOGIN = '?complete-login=true';
export const COMPLETE_SIGNUP = '?complete-signup=true';
