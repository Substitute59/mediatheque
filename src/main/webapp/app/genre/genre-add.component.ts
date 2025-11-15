import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GenreService } from './genre.service';
import { GenreDTO } from './genre.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-genre-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RatingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './genre-add.component.html'
})
export class GenreAddComponent {
  visible: boolean = false;
  name: string = '';
  errorName: string = '';
  errorMessage: string = '';
  mediaTypeId = input<number>();
  @Output() saveGenre = new EventEmitter<void>();
  
  constructor(
    private genreService: GenreService,
    private notif: NotificationService
  ) {}

  addGenre() {
    let hasError: boolean = false;
    if (this.name === '') {
      this.errorName = $localize`:@@genre.add.name.error:Vous devez renseigner un nom`;
      hasError = true;
    } else {
      this.errorName = '';
    }

    if (hasError) {
      return;
    }
    
    const data = new GenreDTO({
      name: this.name,
      mediaType: this.mediaTypeId(),
    });

    this.genreService.createGenre(data)
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@genre.add.success.title:Genre ajouté !`,
            $localize`:@@genre.add.success.text:Il sera désormais visible dans la liste.`,
          );
          this.saveGenre.emit();
          this.visible = false;
        },
        error: () => this.errorMessage = $localize`:@@genre.add.error:Une erreur est survenue !`
      });
  }
}
