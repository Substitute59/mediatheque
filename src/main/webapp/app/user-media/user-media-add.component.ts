import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UserMediaService } from 'app/user-media/user-media.service';
import { UserMediaDTO } from 'app/user-media/user-media.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-user-media-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './user-media-add.component.html'
})
export class UserMediaAddComponent implements OnInit {

  userMediaService = inject(UserMediaService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  mediaValues?: Map<number,string>;
  flagValues?: Map<number,string>;

  addForm = new FormGroup({
    personalNotes: new FormControl(null),
    user: new FormControl(null, [Validators.required]),
    media: new FormControl(null, [Validators.required]),
    flag: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@userMedia.create.success:User Media was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.userMediaService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.userMediaService.getMediaValues()
        .subscribe({
          next: (data) => this.mediaValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.userMediaService.getFlagValues()
        .subscribe({
          next: (data) => this.flagValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new UserMediaDTO(this.addForm.value);
    this.userMediaService.createUserMedia(data)
        .subscribe({
          next: () => this.router.navigate(['/userMedias'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
