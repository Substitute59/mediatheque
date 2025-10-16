import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ArtistService } from 'app/artist/artist.service';
import { ArtistDTO } from 'app/artist/artist.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-artist-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './artist-add.component.html'
})
export class ArtistAddComponent {

  artistService = inject(ArtistService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
    type: new FormControl(null, [Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@artist.create.success:Artist was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ArtistDTO(this.addForm.value);
    this.artistService.createArtist(data)
        .subscribe({
          next: () => this.router.navigate(['/artists'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
