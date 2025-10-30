import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MediaService } from 'app/media/media.service';
import { MediaDTO } from 'app/media/media.model';
import { AuthService } from '../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

interface SelectOption {
  label: string;
  value: string;
};

@Component({
  selector: 'app-media-list',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    Select,
    RouterLink
  ],
  templateUrl: './media-list.component.html'})
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

  constructor(
    private mediaService: MediaService,
    private auth: AuthService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private route: ActivatedRoute
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
          if (media.mediaMediaCollections) {
            media.mediaMediaCollections.forEach(collection => {
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

  onSortChange(event: any) {
    const sortValue = event.value.value;
    this.sortMedias(sortValue);
  }

  onFilterChange(event: any, filterType: string) {
    const filterValue = event.value.value;
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
        media.mediaMediaCollections?.some(collection => collection.id!.toString() === this.selectedCollectionOption!.value)
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

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@media.delete.success:Media was removed successfully.`,
      'media.mediaArtist.media.referenced': $localize`:@@media.mediaArtist.media.referenced:This entity is still referenced by Media Artist ${details?.id} via field Media.`,
      'media.mediaCollection.media.referenced': $localize`:@@media.mediaCollection.media.referenced:This entity is still referenced by Media Collection ${details?.id} via field Media.`,
      'media.review.media.referenced': $localize`:@@media.review.media.referenced:This entity is still referenced by Review ${details?.id} via field Media.`,
      'media.userMedia.media.referenced': $localize`:@@media.userMedia.media.referenced:This entity is still referenced by User Media ${details?.id} via field Media.`
    };
    return messages[key];
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.mediaService.deleteMedia(id)
        .subscribe({
          next: () => this.router.navigate(['/medias'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/medias'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error)
          }
        });
  }

  toggleFilterPanel() {
    this.filterPanelVisible = !this.filterPanelVisible;
  }
}
