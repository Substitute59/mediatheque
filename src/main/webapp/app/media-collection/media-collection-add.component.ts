import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaCollectionService } from 'app/media-collection/media-collection.service';
import { MediaCollectionDTO } from 'app/media-collection/media-collection.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-media-collection-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-collection-add.component.html'
})
export class MediaCollectionAddComponent implements OnInit {

  mediaCollectionService = inject(MediaCollectionService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  collectionValues?: Map<number,string>;

  addForm = new FormGroup({
    position: new FormControl(null),
    type: new FormControl(null, [Validators.maxLength(100)]),
    media: new FormControl(null, [Validators.required]),
    collection: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@mediaCollection.create.success:Media Collection was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.mediaCollectionService.getMediaValues()
        .subscribe({
          next: (data) => this.mediaValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaCollectionService.getCollectionValues()
        .subscribe({
          next: (data) => this.collectionValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MediaCollectionDTO(this.addForm.value);
    this.mediaCollectionService.createMediaCollection(data)
        .subscribe({
          next: () => this.router.navigate(['/mediaCollections'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
