import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaService } from 'app/media/media.service';
import { MediaDTO } from 'app/media/media.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-media-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-add.component.html'
})
export class MediaAddComponent {

  mediaService = inject(MediaService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    title: new FormControl(null, [Validators.maxLength(255)]),
    type: new FormControl(null, [Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@media.create.success:Media was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MediaDTO(this.addForm.value);
    this.mediaService.createMedia(data)
        .subscribe({
          next: () => this.router.navigate(['/medias'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
