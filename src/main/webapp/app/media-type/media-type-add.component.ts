import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaTypeService } from 'app/media-type/media-type.service';
import { MediaTypeDTO } from 'app/media-type/media-type.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-media-type-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-type-add.component.html'
})
export class MediaTypeAddComponent {

  mediaTypeService = inject(MediaTypeService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(100)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@mediaType.create.success:Media Type was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MediaTypeDTO(this.addForm.value);
    this.mediaTypeService.createMediaType(data)
        .subscribe({
          next: () => this.router.navigate(['/mediaTypes'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
