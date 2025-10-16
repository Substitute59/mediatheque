import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { GenreService } from 'app/genre/genre.service';
import { GenreDTO } from 'app/genre/genre.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-genre-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './genre-add.component.html'
})
export class GenreAddComponent implements OnInit {

  genreService = inject(GenreService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  mediaTypeValues?: Map<number,string>;

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    mediaType: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@genre.create.success:Genre was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.genreService.getMediaTypeValues()
        .subscribe({
          next: (data) => this.mediaTypeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new GenreDTO(this.addForm.value);
    this.genreService.createGenre(data)
        .subscribe({
          next: () => this.router.navigate(['/genres'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
