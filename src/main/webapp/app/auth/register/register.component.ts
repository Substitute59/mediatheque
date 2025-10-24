import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from '../auth.service';
import { UserSchema } from '../../user/user.schema';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FileUploadModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([`/users/edit/${this.auth.currentUserValue?.id}`])
    }

    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      avatar: ['']
    });
  }

  onFileSelect(event: UploadEvent) {
    const file = event.files?.[0];
    if (file) {
      this.registerForm.patchValue({ avatar: file });
    }
  }

  register() {
    const result = UserSchema.safeParse(this.registerForm.value);

    if (!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;
      switch (this.errorField) {
        case 'username':
          this.errorMessage = $localize`:@@registerErrorUsername:${message}`;
          break;
        case 'password':
          this.errorMessage = $localize`:@@registerErrorPassword:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@registerErrorGeneric:Une erreur est survenue.`;
      }
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.value.username);
    formData.append('password', this.registerForm.value.password);

    const avatar = this.registerForm.value.avatar;
    if (avatar) {
      formData.append('avatar', avatar, avatar.name);
    }

    this.auth.register(formData).subscribe({
      next: () => {
        this.auth.login(this.registerForm.value.username, this.registerForm.value.password).subscribe({
          next: () => this.router.navigate(['/'])
        });
      },
      error: () => {
        this.errorMessage = $localize`:@@registerError:Cet email est déjà utilisé`;
        this.errorField = 'username';
      }
    });
  }
}
