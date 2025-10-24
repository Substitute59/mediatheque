import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string().email('Votre email n\'est pas valide'),
  password: z.string().min(8, 'Votre mot de passe doit contenir 8 caractères minimum')
});

export type User = z.infer<typeof UserSchema>;
