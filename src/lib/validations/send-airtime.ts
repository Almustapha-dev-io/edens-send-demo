import { toZod } from 'tozod';
import * as z from 'zod';

import { PHONE_NUMBER_PATTERN } from '@/constants';

export const RecipientDetailsSchema = z.object({
  country: z.object({
    label: z.string(),
    value: z.late.object(() => ({})) as toZod<TAirtimeCountry>,
    iconUrl: z.string().optional(),
  }),
  network: z.object({
    label: z.string(),
    value: z.late.object(() => ({})) as toZod<TAirtimeBillProvider>,
    iconUrl: z.string().optional(),
  }),
  product: z.object({
    label: z.string(),
    value: z.late.object(() => ({})) as toZod<TAirtimeBillProviderProduct>,
    iconUrl: z.string().optional(),
  }),
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_PATTERN, 'Enter a valid phone number'),
  email: z.string().max(0, 'Invalid email').or(z.string().email()),
});

export type TRecipientDetails = z.infer<typeof RecipientDetailsSchema>;

export const SendAirtimeAmountSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(300, 'Cannot transfer more than $300')
    .or(
      z.string().refine(
        (value) => {
          const parsedValue = +value;
          return (
            !isNaN(parsedValue) &&
            isFinite(parsedValue) &&
            parsedValue > 0 &&
            parsedValue <= 5_000
          );
        },
        { message: 'Enter a valid amount not more than $300' }
      )
    ),
});

export type TSendAirtimeAmount = z.infer<typeof SendAirtimeAmountSchema>;
