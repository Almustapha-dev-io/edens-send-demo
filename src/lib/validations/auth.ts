import * as z from 'zod';

import { PHONE_NUMBER_PATTERN } from '@/constants';

export const SignupSchema = z
  .object({
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export type TSignupForm = z.infer<typeof SignupSchema>;

export const NewSignupSchema = z.object({
  firstName: z.string().min(2, 'Must be at least 2 characters'),
  lastName: z.string().min(2, 'Must be at least 2 characters'),
  email: z.string().email(),
  phone: z.string().regex(PHONE_NUMBER_PATTERN, 'Enter a valid phone number'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

export type TNewSignupForm = z.infer<typeof NewSignupSchema>;
