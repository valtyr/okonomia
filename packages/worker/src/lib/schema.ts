import { z } from 'zod';

export const User = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  isInEconomics: z.boolean(),
  imageKey: z.string(),
  hasPaid: z.boolean().default(false),
});
export type User = z.infer<typeof User>;

export const CreateUserInput = User.pick({
  name: true,
  phone: true,
  email: true,
  isInEconomics: true,
  imageKey: true,
});
export type CreateUserInput = z.infer<typeof CreateUserInput>;
