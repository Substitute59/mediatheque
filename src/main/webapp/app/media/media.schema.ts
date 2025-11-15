import { z } from 'zod';

export const MediaSchema = z.object({
  title: z.string().min(1, 'Veuillez renseigner un titre.'),
  mediaType: z.string().refine(val => val !== '', {
    message: 'Veuillez sélectionner un type de média.',
  })
});
