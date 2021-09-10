import { z } from 'zod';

const trim = (s: string) => s.trim();

export const User = z.object({
  id: z.string(),
  name: z.string().transform(trim),
  phone: z.string().transform(trim),
  kennitala: z.string().transform(trim),
  email: z.string().email().transform(trim),
  isInEconomics: z.boolean(),
  imageKey: z.string(),
  hasPaid: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  hasReceivedPass: z.boolean().default(false),
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
