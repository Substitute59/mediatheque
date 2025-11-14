import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../notification/notification.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MediaService } from './media.service';
import { GenreService } from '../genre/genre.service';
import { UserMediaService } from '../user-media/user-media.service';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from '../auth/auth.service';
import { MediaSchema } from './media.schema';
import { UserMediaDTO } from '../user-media/user-media.model';
import { GenreDTO } from '../genre/genre.model';
import { MediaDTO } from './media.model';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-media-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FileUploadModule,
    MultiSelectModule,
    SelectModule,
    ToastModule,
    RouterLink
  ],
  templateUrl: './media-add.component.html'
})
export class MediaAddComponent {
  addMediaForm: FormGroup;
  errorField: string | number = '';
  errorMessage: string = '';
  mediaTypeValues?: {label: string | number, value: string}[];
  genres?: GenreDTO[];
  genreValues?: {label: string | number, value: string}[];
  platformValues?: {label: string | number, value: string}[];
  mediaTagTagsValues?: {label: string | number, value: string}[];
  selectedCover?: File;
  now: string = new Date().toISOString();

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandler,
    private mediaService: MediaService,
    private router: Router,
    private notif: NotificationService,
    private userMediaService: UserMediaService, 
    private genreService: GenreService
  ) {
    this.addMediaForm = this.fb.group({
      title: [''],
      description: [''],
      createdAt: [this.now],
      updatedAt: [this.now],
      mediaType: [''],
      genre: [''],
      platform: [''],
      createdBy: [this.auth.currentUserValue?.id!],
      mediaTagTags: ['']
    });
    this.mediaService.getMediaTypeValues()
      .subscribe({
        next: (data) => this.mediaTypeValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.genreService.getAllGenres()
      .subscribe({
        next: (data) => this.genres = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.mediaService.getPlatformValues()
      .subscribe({
        next: (data) => this.platformValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.mediaService.getMediaTagTagsValues()
      .subscribe({
        next: (data) => this.mediaTagTagsValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.addMediaForm.get('mediaType')?.valueChanges.subscribe(value => {
      this.updateGenresList(value);
      if (value !== 3) {
        this.addMediaForm.get('platform')?.reset();
      }
    });
  }

  updateGenresList(mediaTypeId: number) {
    this.genreValues = this.genres
      ?.filter((genre: GenreDTO) => genre.mediaType === +mediaTypeId)
      .map((genre: GenreDTO) => {
        return {
          label: genre.name as string | number,
          value: genre.id?.toString() as string
        }
      });
  }

  onFileSelect(event: UploadEvent) {
    const file = event.files?.[0];
    if (file) {
      this.selectedCover = file;
    }
  }

  addMedia() {
    const result = MediaSchema.safeParse(this.addMediaForm.value);
    
    if (!result.success) {
      this.errorField = result.error.issues[0].path[0];
      const message = result.error.issues[0].message;
      switch (this.errorField) {
        case 'title':
          this.errorMessage = $localize`:@@addMediaErrorTitle:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@addMediaErrorGeneric:Une erreur est survenue.`;
      }
      return;
    }

    const dto = this.addMediaForm.value;
    dto.mediaTagTags = dto.mediaTagTags.map((t: any) => t.value);

    this.mediaService.createMedia(dto, this.selectedCover)
      .subscribe({
        next: (mediaId) => {
          const userMedia: UserMediaDTO = {
            user: this.auth.currentUserValue?.id!,
            media: mediaId,
            flag: 1,
            addedDate: this.now
          };
          this.userMediaService.createUserMedia(userMedia)
            .subscribe({
              next: (mediaId) => {
                this.notif.showSuccess(
                  $localize`:@@media.add.success.title:Média ajouté !`,
                  $localize`:@@media.add.success.text:Vous pourrez le retrouver dans votre médiathèque.`
                );
              },
              error: () => this.errorMessage = $localize`:@@media.add.error:Une erreur est survenue lors de l'ajout.`
            });
          setTimeout(() => {
            this.router.navigate(['/medias']);
          }, 3000);
        },
        error: () => this.errorMessage = $localize`:@@media.add.error:Une erreur est survenue lors de l'ajout.`
      });
  }
}
