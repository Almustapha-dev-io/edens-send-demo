import * as z from 'zod';

const MomoWalletRecipientSchema = z.object({
  walletType: z.literal('mtnMomo'),
  phoneNumber: z.string(),
  email: z.string().max(0).or(z.string().email()),
  name: z
    .string()
    .min(5, 'Must be at least 5 characters')
    .refine(
      (val) => val.trim().includes(' '),
      'Names must be separated by spaces'
    ),
  narration: z.string().optional(),
});

const EdensWalletSchema = z.object({
  walletType: z.literal('edens'),
  walletNumber: z.string().min(1, 'Can not be empty'),
  narration: z.string().optional(),
});

export const RecipientWalletSchema = z.discriminatedUnion('walletType', [
  MomoWalletRecipientSchema,
  EdensWalletSchema,
]);

export type TRecipientWallet = z.infer<typeof RecipientWalletSchema>;

export const RecipientBankSchema = z.object({
  bank: z.object({
    label: z.string().min(1),
    value: z.string(),
    iconUrl: z.string().optional(),
  }),
  accountNumber: z.string().min(1, 'Can not be empty'),
  narration: z.string().optional(),
});

export type TRecipientBank = z.infer<typeof RecipientBankSchema>;

export const SenderDetailsSchema = z.object({
  firstName: z.string().min(2, 'Must be at least 2 characters'),
  lastName: z.string().min(2, 'Must be at least 2 characters'),
  phoneNumber: z.string(),
  email: z.string().email(),
});

export type TSenderDetails = z.infer<typeof SenderDetailsSchema>;

export const SendMoneyAmountSchema = z.object({
  // amount: z.string().refine((value) => {
  //   const parsedValue = +value;
  //   return !isNaN(parsedValue) && isFinite(parsedValue);
  // }),
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
            parsedValue <= 300
          );
        },
        { message: 'Enter a valid amount not more than $300' }
      )
    ),
});

export type TSendMoneyAmount = z.infer<typeof SendMoneyAmountSchema>;
