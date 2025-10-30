import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().email('Votre email n\'est pas valide'),
  password: z.string().min(8, 'Votre mot de passe doit contenir 8 caractères minimum')
});

export const RegisterSchema = LoginSchema;

export const UserEditSchema = z.object({
  password: z.string().min(8, 'Votre mot de passe doit contenir 8 caractères minimum')
});

export const ForgotPasswordSchema = z.object({
  username: z.string().email('Votre email n\'est pas valide')
});

export const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8, $localize`:@@resetPasswordErrorPasswordMinLength:Le mot de passe doit contenir au moins 8 caractères`),
  confirmPassword: z.string()
    .min(1, $localize`:@@resetPasswordErrorConfirmPasswordRequired:Veuillez confirmer votre mot de passe`)
}).refine((data) => data.password === data.confirmPassword, {
  message: $localize`:@@resetPasswordErrorPasswordMismatch:Les mots de passe ne correspondent pas`,
  path: ['confirmPassword']
});
