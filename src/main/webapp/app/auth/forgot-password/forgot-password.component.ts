import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  username: z.string().email('Votre email n\'est pas valide')
});

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './forgot-password.component.html',
  providers: [MessageService]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private messageService: MessageService) {
    this.forgotPasswordForm = this.fb.group({
      username: ['']
    });
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
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
          this.showSuccess($localize`:@@forgotPasswordSuccessTitle:Demande bien reçue !`, this.errorMessage);
        },
        error: () => {
          this.errorMessage = $localize`:@@forgotPasswordError:Une erreur est survenue.`;
          this.errorField = '';
        }
      });
    }
  }
}
