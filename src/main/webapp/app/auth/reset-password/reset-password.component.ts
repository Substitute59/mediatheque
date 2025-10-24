import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8, $localize`:@@resetPasswordErrorPasswordMinLength:Le mot de passe doit contenir au moins 8 caractères`),
  confirmPassword: z.string()
    .min(1, $localize`:@@resetPasswordErrorConfirmPasswordRequired:Veuillez confirmer votre mot de passe`)
}).refine((data) => data.password === data.confirmPassword, {
  message: $localize`:@@resetPasswordErrorPasswordMismatch:Les mots de passe ne correspondent pas`,
  path: ['confirmPassword']
});

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './reset-password.component.html',
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  errorField: string | number = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMessage = $localize`:@@resetPasswordErrorInvalidToken:Token invalide`;
      this.errorField = 'token';
    }
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  resetPassword() {
    this.errorMessage = '';
    this.errorField = '';

    const result = ResetPasswordSchema.safeParse(this.resetPasswordForm.value);

    if (!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;
      
      switch (this.errorField) {
        case 'password':
          this.errorMessage = message;
          break;
        case 'confirmPassword':
          this.errorMessage = message;
          break;
        default:
          this.errorMessage = $localize`:@@resetPasswordErrorGeneric:Une erreur est survenue.`;
      }
      return;
    }

    if (!this.token) {
      this.errorMessage = $localize`:@@resetPasswordErrorInvalidToken:Token invalide`;
      return;
    }

    this.auth.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe({
      next: () => {
        const successMsg = $localize`:@@resetPasswordSuccessMsg:Vous pouvez maintenant vous connecter.`;
        this.showSuccess(
          $localize`:@@resetPasswordSuccessTitle:Mot de passe mis à jour !`, 
          successMsg
        );
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => {
        this.errorMessage = $localize`:@@resetPasswordErrorFailed:La réinitialisation a échoué`;
        this.errorField = '';
      }
    });
  }
}
