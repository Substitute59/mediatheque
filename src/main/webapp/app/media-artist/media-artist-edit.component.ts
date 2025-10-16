import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaArtistService } from 'app/media-artist/media-artist.service';
import { MediaArtistDTO } from 'app/media-artist/media-artist.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-media-artist-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-artist-edit.component.html'
})
export class MediaArtistEditComponent implements OnInit {

  mediaArtistService = inject(MediaArtistService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  artistValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    role: new FormControl(null, [Validators.maxLength(100)]),
    media: new FormControl(null, [Validators.required]),
    artist: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@mediaArtist.update.success:Media Artist was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.mediaArtistService.getMediaValues()
        .subscribe({
          next: (data) => this.mediaValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaArtistService.getArtistValues()
        .subscribe({
          next: (data) => this.artistValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.mediaArtistService.getMediaArtist(this.currentId!)
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
    const data = new MediaArtistDTO(this.editForm.value);
    this.mediaArtistService.updateMediaArtist(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/mediaArtists'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
