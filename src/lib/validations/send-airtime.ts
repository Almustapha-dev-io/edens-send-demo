import * as z from 'zod';

export const RecipientDetailsSchema = z.object({
  country: z.object({
    label: z.string(),
    value: z.string(),
    iconUrl: z.string().optional(),
  }),
  network: z.object({
    label: z.string(),
    value: z.string(),
    iconUrl: z.string().optional(),
  }),
  phoneNumber: z.string().min(1),
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
