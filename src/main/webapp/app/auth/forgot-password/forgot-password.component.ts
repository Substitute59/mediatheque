import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth.service';
import { ForgotPasswordSchema } from '../../user/user.schema';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private notif: NotificationService
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['']
    });
  }

  forgotPassword() {
    const result = ForgotPasswordSchema.safeParse(this.forgotPasswordForm.value);
    if(!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;

      switch (this.errorField) {
        case 'username':
          this.errorMessage = $localize`:@@forgotPasswordErrorUsername:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@forgotPasswordErrorGeneric:Une erreur est survenue.`;
      }
    } else {
      this.auth.forgotPassword(this.forgotPasswordForm.value.username).subscribe({
        next: () => {
          this.errorMessage = $localize`:@@forgotPasswordSuccessMsg:Si un compte existe avec cet email, un lien de réinitialisation vous sera envoyé`;
          this.errorField = '';
          this.notif.showSuccess($localize`:@@forgotPasswordSuccessTitle:Demande bien reçue !`, this.errorMessage);
        },
        error: () => {
          this.errorMessage = $localize`:@@forgotPasswordError:Une erreur est survenue.`;
          this.errorField = '';
        }
      });
    }
  }
}
