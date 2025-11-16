import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../notification/notification.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MediaService } from './media.service';
import { GenreService } from '../genre/genre.service';
import { UserMediaService } from '../user-media/user-media.service';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from '../auth/auth.service';
import { MediaSchema } from './media.schema';
import { MediaDTO } from './media.model';
import { UserMediaDTO } from '../user-media/user-media.model';
import { GenreDTO } from '../genre/genre.model';
import { GenreAddComponent } from '../genre/genre-add.component';
import { PlatformAddComponent } from '../platform/platform-add.component';
import { TagAddComponent } from '../tag/tag-add.component';
import { CollectionAddComponent } from '../collection/collection-add.component';
import { ArtistAddComponent } from '../artist/artist-add.component';
import { environment } from 'environments/environment';

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
    InputNumberModule,
    FileUploadModule,
    MultiSelectModule,
    SelectModule,
    ToastModule,
    RouterLink,
    GenreAddComponent,
    PlatformAddComponent,
    CollectionAddComponent,
    ArtistAddComponent,
    TagAddComponent
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
  mediaMediaArtistsValues?: {label: string | number, value: string}[];
  mediaMediaCollectionsValues?: {label: string | number, value: string}[];
  selectedCover?: File;
  now: string = new Date().toISOString();
  currentId?: number;
  coverUrl?: string;
  environment = environment;
  media?: MediaDTO;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandler,
    private mediaService: MediaService,
    private router: Router,
    private notif: NotificationService,
    private userMediaService: UserMediaService, 
    private genreService: GenreService,
    private route: ActivatedRoute
  ) {
    this.currentId = +this.route.snapshot.params['id'];
    if (this.currentId) {
      this.mediaService.getMedia(this.currentId, this.auth.currentUserValue?.id!)
        .subscribe({
          next: (data) => {
            this.media = data;
            this.updateForm();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    }
    this.addMediaForm = this.fb.group({
      title: [''],
      description: [''],
      createdAt: [this.now],
      updatedAt: [this.now],
      mediaType: [''],
      genre: [''],
      platform: [''],
      createdBy: [this.auth.currentUserValue?.id!],
      mediaTagTags: [''],
      mediaMediaArtists: [''],
      mediaMediaCollections: [''],
      collectionType: [''],
      collectionPosition: ['']
    });
    this.loadMediaTypes();
    this.loadGenres();
    this.loadPlatforms();
    this.loadTags();
    this.loadArtists();
    this.loadCollections();
    this.addMediaForm.get('mediaType')?.valueChanges.subscribe(value => {
      this.filterGenresList(value);
      if (value !== 3) {
        this.addMediaForm.get('platform')?.reset();
      }
    });
  }

  updateForm() {
    if (this.media) {
      this.addMediaForm.patchValue({
        title: this.media.title,
        description: this.media.description,
        mediaType: String(this.media.mediaType?.id),
        genre: String(this.media.genre?.id),
        platform: String(this.media.platform?.id),
        mediaTagTags: this.media.mediaTagTags
          ?.map(tag => this.mediaTagTagsValues?.find(o => o.value === String(tag.id)))
          .filter(Boolean),
        mediaMediaArtists: this.media.mediaMediaArtists
          ?.map(artist => this.mediaMediaArtistsValues?.find(o => o.value === String(artist.id)))
          .filter(Boolean),
        mediaMediaCollections: String(this.media.mediaCollections?.[0].id),
        collectionType: this.media.mediaMediaCollections?.[0].type,
        collectionPosition: String(this.media.mediaMediaCollections?.[0].position)
      });
      this.coverUrl = this.media.coverUrl!;
    }
  }

  loadMediaTypes() {
    this.mediaService.getMediaTypeValues()
      .subscribe({
        next: (data) => {
          this.mediaTypeValues = data;
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  loadGenres(callback: () => void = () => {}) {
    this.genreService.getAllGenres()
      .subscribe({
        next: (data) => {
          this.genres = data;
          callback();
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  filterGenresList(mediaTypeId: number) {
    this.genreValues = this.genres
      ?.filter((genre: GenreDTO) => genre.mediaType === +mediaTypeId)
      .map((genre: GenreDTO) => {
        return {
          label: genre.name as string | number,
          value: genre.id?.toString() as string
        }
      });
  }

  updateGenresList() {
    this.loadGenres(() => this.filterGenresList(this.addMediaForm.value.mediaType));
  }

  loadPlatforms() {
    this.mediaService.getPlatformValues()
      .subscribe({
        next: (data) => {
          this.platformValues = data;
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  loadTags() {
    this.mediaService.getMediaTagTagsValues()
      .subscribe({
        next: (data) => {
          this.mediaTagTagsValues = data;
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  loadArtists() {
    this.mediaService.getMediaMediaArtistsValues()
      .subscribe({
        next: (data) => {
          this.mediaMediaArtistsValues = data;
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  loadCollections() {
    this.mediaService.getMediaMediaCollectionsValues()
      .subscribe({
        next: (data) => {
          this.mediaMediaCollectionsValues = data;
          this.updateForm();
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
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
        case 'mediaType':
          this.errorMessage = $localize`:@@addMediaErrorMediaType:${message}`;
          break;
        default:
          this.errorMessage = $localize`:@@addMediaErrorGeneric:Une erreur est survenue.`;
      }
      return;
    }

    const dto = { ...this.addMediaForm.value };

    Object.keys(dto).forEach(key => {
      if (dto[key] === 'undefined') {
        dto[key] = null;
      }

      if (Array.isArray(dto[key])) {
        dto[key] = dto[key].map(v => v === 'undefined' ? null : v);
      }
    });

    if (dto.mediaTagTags) {
      dto.mediaTagTags = dto.mediaTagTags.map((t: any) => t.value);
    }
    if (dto.mediaMediaArtists) {
      dto.mediaMediaArtists = dto.mediaMediaArtists.map((t: any) => t.value);
    }
    if (dto.mediaMediaCollections) {
      dto.mediaMediaCollections = {
        collection: dto.mediaMediaCollections,
        type: dto.collectionType || 'Volume',
        position: dto.collectionPosition || 1
      };
      if (this.currentId) {
        dto.mediaMediaCollections.media = this.currentId;
      }
      if (this.media && this.media.mediaMediaCollections) {
        dto.mediaMediaCollections.id = this.media.mediaMediaCollections[0].id;
      }
    }

    if (this.currentId) {
      this.mediaService.updateMedia(this.currentId, dto, this.selectedCover)
        .subscribe({
          next: () => {
            this.notif.showSuccess(
              $localize`:@@media.edit.success.title:Média modifié !`,
              $localize`:@@media.edit.success.text:Vous pourrez le retrouver dans votre médiathèque.`
            );
            setTimeout(() => {
              this.router.navigate(['/collection']);
            }, 3000);
          },
          error: () => this.errorMessage = $localize`:@@media.edit.error:Une erreur est survenue lors de la mise à jour.`
        });

      return;
    }

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
            this.router.navigate(['/collection']);
          }, 3000);
        },
        error: () => this.errorMessage = $localize`:@@media.add.error:Une erreur est survenue lors de l'ajout.`
      });
  }
}
