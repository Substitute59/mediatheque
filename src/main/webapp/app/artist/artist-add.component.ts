import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArtistService } from './artist.service';
import { ArtistDTO } from './artist.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-artist-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RatingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './artist-add.component.html'
})
export class ArtistAddComponent {
  visible: boolean = false;
  name: string = '';
  type: string = '';
  errorName: string = '';
  errorType: string = '';
  errorMessage: string = '';
  @Output() saveArtist = new EventEmitter<void>();
  
  constructor(
    private artistService: ArtistService,
    private notif: NotificationService
  ) {}

  addArtist() {
    let hasError: boolean = false;
    if (this.name === '') {
      this.errorName = $localize`:@@artist.add.name.error:Vous devez renseigner un nom`;
      hasError = true;
    } else {
      this.errorName = '';
    }

    if (this.type === '') {
      this.errorType = $localize`:@@artist.add.type.error:Vous devez renseigner un type`;
      hasError = true;
    } else {
      this.errorType = '';
    }

    if (hasError) {
      return;
    }
    
    const data = new ArtistDTO({
      name: this.name,
      type: this.type
    });

    this.artistService.createArtist(data)
      .subscribe({
        next: () => {
          this.notif.showSuccess(
            $localize`:@@artist.add.success.title:Artiste ajouté !`,
            $localize`:@@artist.add.success.text:Il sera désormais visible dans la liste.`,
          );
          this.saveArtist.emit();
          this.visible = false;
        },
        error: () => this.errorMessage = $localize`:@@artist.add.error:Une erreur est survenue !`
      });
  }
}
