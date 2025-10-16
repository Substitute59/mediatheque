import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaCollectionService } from 'app/media-collection/media-collection.service';
import { MediaCollectionDTO } from 'app/media-collection/media-collection.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-media-collection-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-collection-edit.component.html'
})
export class MediaCollectionEditComponent implements OnInit {

  mediaCollectionService = inject(MediaCollectionService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  collectionValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    position: new FormControl(null),
    type: new FormControl(null, [Validators.maxLength(100)]),
    media: new FormControl(null, [Validators.required]),
    collection: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@mediaCollection.update.success:Media Collection was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.mediaCollectionService.getMediaCollection(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new MediaCollectionDTO(this.editForm.value);
    this.mediaCollectionService.updateMediaCollection(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/mediaCollections'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
