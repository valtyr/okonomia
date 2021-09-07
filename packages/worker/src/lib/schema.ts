import { z } from 'zod';

export const User = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  kennitala: z.string(),
  email: z.string().email(),
  isInEconomics: z.boolean(),
  imageKey: z.string(),
  hasPaid: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  year: z.enum(['first', 'second', 'third', 'other']),
});
export type User = z.infer<typeof User>;

export const CreateUserInput = User.pick({
  name: true,
  phone: true,
  kennitala: true,
  email: true,
  isInEconomics: true,
  imageKey: true,
  year: true,
});
export type CreateUserInput = z.infer<typeof CreateUserInput>;
