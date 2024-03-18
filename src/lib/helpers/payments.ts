import { paymentsBaseUrl } from '../env';

export const generatePaymentLink = ({
  amount,
  formattedAmount,
  ref,
}: {
  ref: string;
  amount: number;
  formattedAmount: string;
}) => {
  const url = new URL(paymentsBaseUrl);
  url.searchParams.append('reference', ref);
  url.searchParams.append('amount', amount.toFixed(2));
  url.searchParams.append('formattedAmount', formattedAmount);
  url.searchParams.append('type', 'EDEN_SEND');

  return url;
};
