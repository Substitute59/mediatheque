import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MediaArtistService } from 'app/media-artist/media-artist.service';
import { MediaArtistDTO } from 'app/media-artist/media-artist.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-media-artist-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './media-artist-add.component.html'
})
export class MediaArtistAddComponent implements OnInit {

  mediaArtistService = inject(MediaArtistService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaValues?: Map<number,string>;
  artistValues?: Map<number,string>;

  addForm = new FormGroup({
    role: new FormControl(null, [Validators.maxLength(100)]),
    media: new FormControl(null, [Validators.required]),
    artist: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@mediaArtist.create.success:Media Artist was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MediaArtistDTO(this.addForm.value);
    this.mediaArtistService.createMediaArtist(data)
        .subscribe({
          next: () => this.router.navigate(['/mediaArtists'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
