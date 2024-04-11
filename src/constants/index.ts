import MobileButtonIcon from '@/components/icons/mobile-button-icon';
import PaperPlaneTopIcon from '@/components/icons/paper-plane-top-icon';
import TimePastIcon from '@/components/icons/time-past-icon';

import { HISTORY_ROUTE, SEND_AIRTIME_ROUTE, SEND_MONEY_ROUTE } from './routes';

export enum HttpMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const APP_FONT = Object.freeze({
  headers: 'Satoshi',
  body: 'Satoshi',
});

export const NAV_ITEMS = [
  {
    icon: PaperPlaneTopIcon,
    label: 'Send Money',
    url: SEND_MONEY_ROUTE,
  },

  {
    icon: MobileButtonIcon,
    label: 'Send Airtime',
    url: SEND_AIRTIME_ROUTE,
  },

  {
    icon: TimePastIcon,
    label: 'History',
    url: HISTORY_ROUTE,
  },
];

export const CARD_SHADOW = '0px 4px 15.199999809265137px 0px #0000000D';
export const POPOVER_SHADOW = '0px 4px 15.199999809265137px 0px #0000000D';
export const TABLE_SHADOW = '0px 4px 15px 0px #0000001A';
export const FLAG_URL = (iso2: string) =>
  `https://flagcdn.com/48x36/${iso2}.png`;

export const PHONE_NUMBER_PATTERN =
  /^([+(\d]{1})(([\d+() -.]){5,16})([+(\d]{1})$/;

export const SIGNUP_EMAIL_SESSION_STORAGE_KEY =
  '@edens.send:sessionStorageEmail';

export * from './routes';
export * from './transaction-params';
