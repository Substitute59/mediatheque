import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArtistService } from './artist.service';
import { ArtistDTO } from './artist.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../notification/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-artist-add',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    BlockUIModule,
    ProgressSpinnerModule,
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
  loading:boolean = false;
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

    this.loading = true;

    this.artistService.createArtist(data)
      .pipe(finalize(() => this.loading = false))
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
