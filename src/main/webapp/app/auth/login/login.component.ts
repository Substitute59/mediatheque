import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { UserSchema } from '../../user/user.schema';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  login() {
    const result = UserSchema.safeParse(this.loginForm.value);
    if(!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;

      switch (this.errorField) {
        case 'username':
          this.errorMessage = $localize`:@@loginErrorUsername:${message}`;
          break;
        case 'password':
          this.errorMessage = $localize`:@@loginErrorPassword:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@loginErrorGeneric:Une erreur est survenue.`;
      }
    } else {
      this.auth.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.errorMessage = $localize`:@@loginError:Identifiants incorrects`;
          this.errorField = '';
        }
      });
    }
  }
}
