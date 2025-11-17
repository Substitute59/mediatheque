import { Component, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { ErrorHandler } from '../common/error-handler.injectable';
import { MediaDTO } from './media.model';
import { MediaService } from './media.service';
import { MediaUtilsService } from './media-utils.service';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from 'environments/environment';
import { finalize } from 'rxjs/operators';

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
    BlockUIModule,
    ProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
  providers: [ConfirmationService]
})
export class MediaListComponent {
  medias?: MediaDTO[];
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
  environment = environment;
  loading:boolean = false;

  queryParams = toSignal(this.route.queryParams, { initialValue: {} as Params });
  params = toSignal(this.route.params, { initialValue: {} as Params });
  flagId = computed(() => {
    const params = this.queryParams();
    const flagIdParam = params['flagId'];
    return flagIdParam ? +flagIdParam : null;
  });
  mediaTypeId = computed(() => {
    const params = this.queryParams();
    const mediaTypeIdParam = params['mediaTypeId'];
    return mediaTypeIdParam ? +mediaTypeIdParam : null;
  });
  q = computed(() => {
    const params = this.params();
    const qParam = params['q'];
    return qParam ? String(qParam) : null;
  });

  constructor(
    private mediaService: MediaService,
    public mediaUtilsService: MediaUtilsService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      const flag = this.flagId();
      const type = this.mediaTypeId();
      const q = this.q();
      const isSearch: boolean = this.route.snapshot.routeConfig?.path?.startsWith('search')!;
      this.loadData(flag, type, isSearch, q);
    });
  }

  loadData(flag: number | null, type: number | null, isSearch: boolean, q: string | null) {
    this.sortByOptions = [
      { label: $localize`:@@media.list.sortBy.default:Trier par`, value: '' },
      { label: $localize`:@@media.list.sortBy.titleAsc:Titre (A → Z)`, value: 'titleAsc' },
      { label: $localize`:@@media.list.sortBy.titleDesc:Titre (Z → A)`, value: 'titleDesc' },
      { label: $localize`:@@media.list.sortBy.addedDateDesc:Date d'ajout (récent → ancien)`, value: 'addedDateDesc' },
      { label: $localize`:@@media.list.sortBy.addedDateAsc:Date d'ajout (ancien → récent)`, value: 'addedDateAsc' }
    ];
    this.selectedSortByOption = this.sortByOptions[0];
    this.loading = true;

    this.mediaService.getAllMedias(this.auth.currentUserValue?.id!, isSearch)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          if (q) {
            data = data.filter(media => 
              (media.title?.toLocaleLowerCase() ?? '').includes(q?.toLocaleLowerCase()) ||
              (media.description?.toLocaleLowerCase() ?? '').includes(q?.toLocaleLowerCase())
            );
          }
          this.firstLoadMedias = data;
          this.medias = data;
          if (type) {
            this.medias = this.medias.filter(media => media.mediaType?.id === type);
          }
          if (flag) {
            this.medias = this.medias.filter(media => media.flag?.id === flag);
          } else if (!flag && !isSearch) {
            this.firstLoadMedias = this.firstLoadMedias.filter(media => media.flag?.id !== 2);
            this.medias = this.medias.filter(media => media.flag?.id !== 2);
          }
          this.typeOptions = this.getOptions('type');
          this.genreOptions = this.getOptions('genre');
          this.artistOptions = this.getOptions('artist');
          this.collectionOptions = this.getOptions('collection');
          this.tagOptions = this.getOptions('tag');
          this.statusOptions = this.getOptions('status');
          this.selectedTypeOption = type
            ? this.typeOptions.find(option => option.value === type!.toString())
            : this.typeOptions[0];
          this.selectedGenreOption = this.genreOptions[0];
          this.selectedArtistOption = this.artistOptions[0];
          this.selectedCollectionOption = this.collectionOptions[0];
          this.selectedTagOption = this.tagOptions[0];
          this.selectedStatusOption = flag
            ? this.statusOptions.find(option => option.value === flag!.toString())
            : this.statusOptions[0];
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
            const exists = options.find(option => option.value === media.mediaType?.id?.toString());
            if (!exists) {
              options.push({
                label: media.mediaType.name!,
                value: media.mediaType?.id?.toString()!
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
            const exists = options.find(option => option.value === media.genre?.id?.toString());
            if (!exists) {
              options.push({
                label: media.genre.name!,
                value: media.genre?.id?.toString()!
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
              const exists = options.find(option => option.value === artist.id?.toString());
              if (!exists) {
                options.push({
                  label: artist.name!,
                  value: artist.id?.toString()!
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
              const exists = options.find(option => option.value === collection.id?.toString());
              if (!exists) {
                options.push({
                  label: collection.name!,
                  value: collection.id?.toString()!
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
              const exists = options.find(option => option.value === tag.id?.toString());
              if (!exists) {
                options.push({
                  label: tag.name!,
                  value: tag.id?.toString()!
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
            const exists = options.find(option => option.value === media.flag?.id?.toString());
            if (!exists) {
              options.push({
                label: media.flag.name!,
                value: media.flag.id?.toString()!
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

  confirmDelete(event: Event, media: MediaDTO) {
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
        this.loading = true;

        this.mediaUtilsService.upsertUserMedia(
          media,
          'remove',
          $localize`:@@media.list.delete.confirmation:Média supprimé de votre médiathèque !`,
          $localize`:@@media.list.delete.confirmation:Il reste disponible dans la recherche si vous voulez l'ajouter à nouveau plus tard.`,
          (mediaId) => {
            this.firstLoadMedias = this.firstLoadMedias?.filter(media => media.id !== mediaId);
            this.medias = this.medias?.filter(media => media.id !== mediaId);
            this.loading = false;
          },
          (mediaId) => {
            this.errorMediaId = parseInt(mediaId, 10);
            this.loading = false;
          }
        );
      },
      reject: () => {},
    });
  }
}
