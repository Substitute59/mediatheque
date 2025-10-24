import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UserSchema } from './user.schema';
import { environment } from 'environments/environment';
import { take } from 'rxjs/operators';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-user-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FileUploadModule,
    ToastModule
  ],
  templateUrl: './user-edit.component.html',
  providers: [MessageService]
})
export class UserEditComponent {
  currentId?: number;
  userEditForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';
  user$ = this.auth.currentUser
  environment = environment

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private messageService: MessageService
  ) {
    this.userEditForm = this.fb.group({
      username: [''],
      password: [''],
      avatar: ['']
    });
    
    this.currentId = +this.route.snapshot.params['id'];
    this.auth.currentUser.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userEditForm.patchValue({ username: user.username });
      }
    });
  }

  onFileSelect(event: UploadEvent) {
    const file = event.files?.[0];
    if (file) {
      this.userEditForm.patchValue({ avatar: file });
    }
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  userEdit() {
    const result = UserSchema.safeParse(this.userEditForm.value);

    if (!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;
      switch (this.errorField) {
        case 'password':
          this.errorMessage = $localize`:@@userEditErrorPassword:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@userEditErrorGeneric:Une erreur est survenue.`;
      }
      return;
    }

    const formData = new FormData();
    formData.append('password', this.userEditForm.value.password);

    const avatar = this.userEditForm.value.avatar;
    if (avatar) {
      formData.append('avatar', avatar, avatar.name);
    }

    this.userService.updateUser(this.currentId!, formData).subscribe({
      next: () => {
        this.auth.login(this.userEditForm.value.username, this.userEditForm.value.password).subscribe({
          next: () => {
            this.errorMessage = $localize`:@@userEditSuccessMsg:Vos nouvelles informations ont bien été enregistrées !`;
            this.errorField = '';
            this.showSuccess($localize`:@@userEditSuccessTitle:Mise à jour réussie !`, this.errorMessage);
          }
        });
      },
      error: () => {
        this.errorMessage = $localize`:@@userEditError:Une erreur est survenue !`;
        this.errorField = '';
      }
    });
  }
}
