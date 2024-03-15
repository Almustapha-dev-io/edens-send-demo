import * as z from 'zod';

import { PHONE_NUMBER_PATTERN } from '@/constants';

const MomoWalletRecipientSchema = z.object({
  walletType: z.literal('MTN_MOMO'),
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_PATTERN, 'Enter a valid phone number'),
  email: z.string().max(0, 'Invalid email').or(z.string().email()),
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
  walletType: z.literal('EDENS360'),
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
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_PATTERN, 'Enter a valid phone number'),
  email: z.string().email(),
});

export type TSenderDetails = z.infer<typeof SenderDetailsSchema>;

export const SendMoneyAmountSchema = z.object({
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

export const SecureTransferSchema = z
  .object({
    senderCountry: z.object({
      label: z.string().min(1),
      value: z.string(),
      iconUrl: z.string().optional(),
    }),
    sourceOfFunds: z.string().min(1, 'Cannot be empty'),
    otherSourceOfFunds: z.string().optional(),
    transferPurpose: z.string().min(1, 'Cannot be empty'),
    otherTransferPurpose: z.string().optional(),
    relationship: z.string().min(1, 'Cannot be empty'),
    otherRelationship: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sourceOfFunds === 'others' && !data.otherSourceOfFunds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherSourceOfFunds'],
        message: 'Enter a source of funds',
      });
    }

    if (data.transferPurpose === 'others' && !data.otherTransferPurpose) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherTransferPurpose'],
        message: 'Enter a purpose of transfer',
      });
    }

    if (data.relationship === 'others' && !data.otherRelationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherRelationship'],
        message: 'Enter relationship',
      });
    }
  });

export type TSecureTransferSchema = z.infer<typeof SecureTransferSchema>;
