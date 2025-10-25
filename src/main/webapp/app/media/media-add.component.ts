import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaService } from 'app/media/media.service';
import { MediaDTO } from 'app/media/media.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-media-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-add.component.html'
})
export class MediaAddComponent implements OnInit {

  mediaService = inject(MediaService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaTypeValues?: Map<number,string>;
  genreValues?: Map<number,string>;
  platformValues?: Map<number,string>;
  createdByValues?: Map<number,string>;
  mediaTagTagsValues?: Map<number,string>;

  addForm = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    description: new FormControl(null),
    coverUrl: new FormControl(null, [Validators.maxLength(500)]),
    createdAt: new FormControl(null, [validOffsetDateTime]),
    updatedAt: new FormControl(null, [validOffsetDateTime]),
    mediaType: new FormControl(null, [Validators.required]),
    genre: new FormControl(null),
    platform: new FormControl(null),
    createdBy: new FormControl(null),
    mediaTagTags: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@media.create.success:Media was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.mediaService.getMediaTypeValues()
        .subscribe({
          next: (data) => this.mediaTypeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaService.getGenreValues()
        .subscribe({
          next: (data) => this.genreValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaService.getPlatformValues()
        .subscribe({
          next: (data) => this.platformValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaService.getCreatedByValues()
        .subscribe({
          next: (data) => this.createdByValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaService.getMediaTagTagsValues()
        .subscribe({
          next: (data) => this.mediaTagTagsValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
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
