import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorHandler } from '../common/error-handler.injectable';
import { MediaDTO } from './media.model';
import { MediaService } from './media.service';
import { UserMediaService } from '../user-media/user-media.service';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-media-list',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule,
    ConfirmDialogModule,
    FormsModule,
    PaginatorModule,
    Select,
    TagModule,
    ToastModule,
    RouterLink
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class MediaListComponent {
  medias?: MediaDTO[];
  mediaTypeId?: number;
  filterPanelVisible: boolean = false;
  sortByOptions: SelectOption[] | undefined;
  selectedSortByOption: SelectOption | undefined;
  typeOptions: SelectOption[] | undefined;
  selectedTypeOption: SelectOption | undefined;
  genreOptions: SelectOption[] | undefined;
  selectedGenreOption: SelectOption | undefined;
  artistOptions: SelectOption[] | undefined;
  selectedArtistOption: SelectOption | undefined;
  collectionOptions: SelectOption[] | undefined;
  selectedCollectionOption: SelectOption | undefined;
  tagOptions: SelectOption[] | undefined;
  selectedTagOption: SelectOption | undefined;
  statusOptions: SelectOption[] | undefined;
  selectedStatusOption: SelectOption | undefined;
  firstLoadMedias?: MediaDTO[];
  displayMode: 'list' | 'grid' = 'grid';
  first: number = 0;
  rows: number = 12;
  fallbackImgUrl: string = $localize`:@@media.img.default:https://placehold.co/600x400?text=Sans+Image`;
  errorMediaId: number = 0;

  constructor(
    private mediaService: MediaService,
    private userMediaService: UserMediaService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.sortByOptions = [
      { label: $localize`:@@media.list.sortBy.default:Trier par`, value: '' },
      { label: $localize`:@@media.list.sortBy.titleAsc:Titre (A → Z)`, value: 'titleAsc' },
      { label: $localize`:@@media.list.sortBy.titleDesc:Titre (Z → A)`, value: 'titleDesc' },
      { label: $localize`:@@media.list.sortBy.addedDateDesc:Date d'ajout (récent → ancien)`, value: 'addedDateDesc' },
      { label: $localize`:@@media.list.sortBy.addedDateAsc:Date d'ajout (ancien → récent)`, value: 'addedDateAsc' }
    ];
    this.selectedSortByOption = this.sortByOptions[0];
    this.mediaTypeId = +this.route.snapshot.queryParams['typeId'];
    this.mediaService.getAllMedias(this.auth.currentUserValue?.id!)
      .subscribe({
        next: (data) => {
          this.firstLoadMedias = data;
          this.medias = data;
          if (this.mediaTypeId) {
            this.medias = data.filter(media => media.mediaType?.id === this.mediaTypeId);
          }
          this.typeOptions = this.getOptions('type');
          this.genreOptions = this.getOptions('genre');
          this.artistOptions = this.getOptions('artist');
          this.collectionOptions = this.getOptions('collection');
          this.tagOptions = this.getOptions('tag');
          this.statusOptions = this.getOptions('status');
          this.selectedTypeOption = this.mediaTypeId
            ? this.typeOptions.find(option => option.value === this.mediaTypeId!.toString())
            : this.typeOptions[0];
          this.selectedGenreOption = this.genreOptions[0];
          this.selectedArtistOption = this.artistOptions[0];
          this.selectedCollectionOption = this.collectionOptions[0];
          this.selectedTagOption = this.tagOptions[0];
          this.selectedStatusOption = this.statusOptions[0];
        },
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  sortByAddedDate(dateA: string, dateB: string): number {
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  }

  getOptions(optionType: string): SelectOption[] {
    const options: SelectOption[] = [];
    switch (optionType) {
      case 'type':
        options.push(
          { label: $localize`:@@media.list.filterby.type:Tous les types`, value: '' }
        );
        this.medias?.map(media => {
          if (media.mediaType) {
            const exists = options.find(option => option.value === media.mediaType!.id!.toString());
            if (!exists) {
              options.push({
                label: media.mediaType.name!,
                value: media.mediaType.id!.toString()
              });
            }
          }
        });
        break;
      case 'genre':
        options.push(
          { label: $localize`:@@media.list.filterby.genre:Tous les genres`, value: '' }
        );
        this.medias?.map(media => {
          if (media.genre) {
            const exists = options.find(option => option.value === media.genre!.id!.toString());
            if (!exists) {
              options.push({
                label: media.genre.name!,
                value: media.genre.id!.toString()
              });
            }
          }
        });
        break;
      case 'artist':
        options.push(
          { label: $localize`:@@media.list.filterby.artist:Tous les artistes`, value: '' }
        );
        this.medias?.map(media => {
          if (media.mediaMediaArtists) {
            media.mediaMediaArtists.forEach(artist => {
              const exists = options.find(option => option.value === artist.id!.toString());
              if (!exists) {
                options.push({
                  label: artist.name!,
                  value: artist.id!.toString()
                });
              }
            });
          }
        });
        break;
      case 'collection':
        options.push(
          { label: $localize`:@@media.list.filterby.collection:Toutes les collections`, value: '' }
        );
        this.medias?.map(media => {
          if (media.mediaCollections) {
            media.mediaCollections.forEach(collection => {
              const exists = options.find(option => option.value === collection.id!.toString());
              if (!exists) {
                options.push({
                  label: collection.name!,
                  value: collection.id!.toString()
                });
              }
            });
          }
        });
        break;
      case 'tag':
        options.push(
          { label: $localize`:@@media.list.filterby.tag:Tous les tags`, value: '' }
        );
        this.medias?.map(media => {
          if (media.mediaTagTags) {
            media.mediaTagTags.forEach(tag => {
              const exists = options.find(option => option.value === tag.id!.toString());
              if (!exists) {
                options.push({
                  label: tag.name!,
                  value: tag.id!.toString()
                });
              }
            });
          }
        });
        break;
      case 'status':
        options.push(
          { label: $localize`:@@media.list.filterby.status:Tous les status`, value: '' }
        );
        this.medias?.map(media => {
          if (media.flag) {
            const exists = options.find(option => option.value === media.flag!.id!.toString());
            if (!exists) {
              options.push({
                label: media.flag.name!,
                value: media.flag.id!.toString()
              });
            }
          }
        });
        break;
      default:
        break;
    }
    return options;
  }

  onSortChange(event: SelectChangeEvent) {
    const sortValue = event.value.value;
    this.sortMedias(sortValue);
  }

  onFilterChange() {
    this.filterMedias();
  }

  sortMedias(sortValue: string) {
    switch (sortValue) {
      case 'addedDateAsc':
        this.medias?.sort((a, b) => this.sortByAddedDate(b.addedDate!, a.addedDate!));
        break;
      case 'addedDateDesc':
        this.medias?.sort((a, b) => this.sortByAddedDate(a.addedDate!, b.addedDate!));
        break;
      case 'titleAsc':
        this.medias?.sort((a, b) => a.title!.localeCompare(b.title!));
        break;
      case 'titleDesc':
        this.medias?.sort((a, b) => b.title!.localeCompare(a.title!));
        break;
      default:
        this.medias?.sort((a, b) => a.id! - b.id!);
        break;
    }
  }

  toggleFilterPanel() {
    this.filterPanelVisible = !this.filterPanelVisible;
  }

  filterMedias() {
    this.medias = this.firstLoadMedias;

    if (this.selectedTypeOption && this.selectedTypeOption.value) {
      this.medias = this.medias?.filter(media => media.mediaType?.id!.toString() === this.selectedTypeOption!.value);
    }
    if (this.selectedGenreOption && this.selectedGenreOption.value) {
      this.medias = this.medias?.filter(media => media.genre?.id!.toString() === this.selectedGenreOption!.value);
    }
    if (this.selectedArtistOption && this.selectedArtistOption.value) {
      this.medias = this.medias?.filter(media =>
        media.mediaMediaArtists?.some(artist => artist.id!.toString() === this.selectedArtistOption!.value)
      );
    }
    if (this.selectedCollectionOption && this.selectedCollectionOption.value) {
      this.medias = this.medias?.filter(media =>
        media.mediaCollections?.some(collection => collection.id!.toString() === this.selectedCollectionOption!.value)
      );
    }
    if (this.selectedTagOption && this.selectedTagOption.value) {
      this.medias = this.medias?.filter(media =>
        media.mediaTagTags?.some(tag => tag.id!.toString() === this.selectedTagOption!.value)
      );
    }
    if (this.selectedStatusOption && this.selectedStatusOption.value) {
      this.medias = this.medias?.filter(media => media.flag?.id!.toString() === this.selectedStatusOption!.value);
    }
    if (this.selectedSortByOption) {
      this.sortMedias(this.selectedSortByOption.value);
    }

    this.typeOptions = this.getOptions('type');
    this.genreOptions = this.getOptions('genre');
    this.artistOptions = this.getOptions('artist');
    this.collectionOptions = this.getOptions('collection');
    this.tagOptions = this.getOptions('tag');
    this.statusOptions = this.getOptions('status');
  }

  setDisplayMode(mode: 'list' | 'grid') {
    this.displayMode = mode;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 12;
  }

  getArtistNames(media: MediaDTO): string {
    return media.mediaMediaArtists?.map(a => a.name).join(', ') || '';
  }

  getAverageRating(media: MediaDTO): number {
    if (!media.mediaReviews || media.mediaReviews.length === 0) {
      return 0;
    }
    const total = media.mediaReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / media.mediaReviews.length;
  }

  getCurrentUserRating(media: MediaDTO): number | null {
    const currentUserId = this.auth.currentUserValue?.id;
    if (!media.mediaReviews || media.mediaReviews.length === 0 || !currentUserId) {
      return null;
    }
    const userReview = media.mediaReviews.find(review => review.user === currentUserId);
    return userReview ? userReview.rating || null : null;
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: $localize`:@@media.list.delete.confirm:Êtes-vous certain de vouloir supprimer ce média de votre médiathèque ?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: $localize`:@@media.list.delete.confirm.cancel:Annuler`,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: $localize`:@@media.list.delete.confirm.validate:Valider`
      },
      accept: () => {
        this.userMediaService.deleteUserMedia(id, this.auth.currentUserValue?.id!)
          .subscribe({
            next: () => {
              this.firstLoadMedias = this.firstLoadMedias?.filter(media => media.id !== id);
              this.medias = this.medias?.filter(media => media.id !== id);
              this.showSuccess(
                $localize`:@@media.list.delete.confirmation:Média supprimé de votre médiathèque !`,
                $localize`:@@media.list.delete.confirmation:Il reste disponible dans la recherche si vous voulez l'ajouter à nouveau plus tard.`,
              );
            },
            error: () => this.errorMediaId = id
          });
      },
      reject: () => {},
    });
  }
}
