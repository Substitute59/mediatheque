import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user/user-list.component';
import { UserAddComponent } from './user/user-add.component';
import { UserEditComponent } from './user/user-edit.component';
import { MediaTypeListComponent } from './media-type/media-type-list.component';
import { MediaTypeAddComponent } from './media-type/media-type-add.component';
import { MediaTypeEditComponent } from './media-type/media-type-edit.component';
import { GenreListComponent } from './genre/genre-list.component';
import { GenreAddComponent } from './genre/genre-add.component';
import { GenreEditComponent } from './genre/genre-edit.component';
import { ArtistListComponent } from './artist/artist-list.component';
import { ArtistAddComponent } from './artist/artist-add.component';
import { ArtistEditComponent } from './artist/artist-edit.component';
import { PlatformListComponent } from './platform/platform-list.component';
import { PlatformAddComponent } from './platform/platform-add.component';
import { PlatformEditComponent } from './platform/platform-edit.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaAddComponent } from './media/media-add.component';
import { MediaEditComponent } from './media/media-edit.component';
import { MediaArtistListComponent } from './media-artist/media-artist-list.component';
import { MediaArtistAddComponent } from './media-artist/media-artist-add.component';
import { MediaArtistEditComponent } from './media-artist/media-artist-edit.component';
import { CollectionListComponent } from './collection/collection-list.component';
import { CollectionAddComponent } from './collection/collection-add.component';
import { CollectionEditComponent } from './collection/collection-edit.component';
import { MediaCollectionListComponent } from './media-collection/media-collection-list.component';
import { MediaCollectionAddComponent } from './media-collection/media-collection-add.component';
import { MediaCollectionEditComponent } from './media-collection/media-collection-edit.component';
import { TagListComponent } from './tag/tag-list.component';
import { TagAddComponent } from './tag/tag-add.component';
import { TagEditComponent } from './tag/tag-edit.component';
import { ReviewListComponent } from './review/review-list.component';
import { ReviewAddComponent } from './review/review-add.component';
import { ReviewEditComponent } from './review/review-edit.component';
import { FlagListComponent } from './flag/flag-list.component';
import { FlagAddComponent } from './flag/flag-add.component';
import { FlagEditComponent } from './flag/flag-edit.component';
import { UserMediaListComponent } from './user-media/user-media-list.component';
import { UserMediaAddComponent } from './user-media/user-media-add.component';
import { UserMediaEditComponent } from './user-media/user-media-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'users',
    component: UserListComponent,
    title: $localize`:@@user.list.headline:Users`
  },
  {
    path: 'users/add',
    component: UserAddComponent,
    title: $localize`:@@user.add.headline:Add User`
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
    title: $localize`:@@user.edit.headline:Edit User`
  },
  {
    path: 'mediaTypes',
    component: MediaTypeListComponent,
    title: $localize`:@@mediaType.list.headline:Media Types`
  },
  {
    path: 'mediaTypes/add',
    component: MediaTypeAddComponent,
    title: $localize`:@@mediaType.add.headline:Add Media Type`
  },
  {
    path: 'mediaTypes/edit/:id',
    component: MediaTypeEditComponent,
    title: $localize`:@@mediaType.edit.headline:Edit Media Type`
  },
  {
    path: 'genres',
    component: GenreListComponent,
    title: $localize`:@@genre.list.headline:Genres`
  },
  {
    path: 'genres/add',
    component: GenreAddComponent,
    title: $localize`:@@genre.add.headline:Add Genre`
  },
  {
    path: 'genres/edit/:id',
    component: GenreEditComponent,
    title: $localize`:@@genre.edit.headline:Edit Genre`
  },
  {
    path: 'artists',
    component: ArtistListComponent,
    title: $localize`:@@artist.list.headline:Artists`
  },
  {
    path: 'artists/add',
    component: ArtistAddComponent,
    title: $localize`:@@artist.add.headline:Add Artist`
  },
  {
    path: 'artists/edit/:id',
    component: ArtistEditComponent,
    title: $localize`:@@artist.edit.headline:Edit Artist`
  },
  {
    path: 'platforms',
    component: PlatformListComponent,
    title: $localize`:@@platform.list.headline:Platforms`
  },
  {
    path: 'platforms/add',
    component: PlatformAddComponent,
    title: $localize`:@@platform.add.headline:Add Platform`
  },
  {
    path: 'platforms/edit/:id',
    component: PlatformEditComponent,
    title: $localize`:@@platform.edit.headline:Edit Platform`
  },
  {
    path: 'medias',
    component: MediaListComponent,
    title: $localize`:@@media.list.headline:Medias`
  },
  {
    path: 'medias/add',
    component: MediaAddComponent,
    title: $localize`:@@media.add.headline:Add Media`
  },
  {
    path: 'medias/edit/:id',
    component: MediaEditComponent,
    title: $localize`:@@media.edit.headline:Edit Media`
  },
  {
    path: 'mediaArtists',
    component: MediaArtistListComponent,
    title: $localize`:@@mediaArtist.list.headline:Media Artists`
  },
  {
    path: 'mediaArtists/add',
    component: MediaArtistAddComponent,
    title: $localize`:@@mediaArtist.add.headline:Add Media Artist`
  },
  {
    path: 'mediaArtists/edit/:id',
    component: MediaArtistEditComponent,
    title: $localize`:@@mediaArtist.edit.headline:Edit Media Artist`
  },
  {
    path: 'collections',
    component: CollectionListComponent,
    title: $localize`:@@collection.list.headline:Collections`
  },
  {
    path: 'collections/add',
    component: CollectionAddComponent,
    title: $localize`:@@collection.add.headline:Add Collection`
  },
  {
    path: 'collections/edit/:id',
    component: CollectionEditComponent,
    title: $localize`:@@collection.edit.headline:Edit Collection`
  },
  {
    path: 'mediaCollections',
    component: MediaCollectionListComponent,
    title: $localize`:@@mediaCollection.list.headline:Media Collections`
  },
  {
    path: 'mediaCollections/add',
    component: MediaCollectionAddComponent,
    title: $localize`:@@mediaCollection.add.headline:Add Media Collection`
  },
  {
    path: 'mediaCollections/edit/:id',
    component: MediaCollectionEditComponent,
    title: $localize`:@@mediaCollection.edit.headline:Edit Media Collection`
  },
  {
    path: 'tags',
    component: TagListComponent,
    title: $localize`:@@tag.list.headline:Tags`
  },
  {
    path: 'tags/add',
    component: TagAddComponent,
    title: $localize`:@@tag.add.headline:Add Tag`
  },
  {
    path: 'tags/edit/:id',
    component: TagEditComponent,
    title: $localize`:@@tag.edit.headline:Edit Tag`
  },
  {
    path: 'reviews',
    component: ReviewListComponent,
    title: $localize`:@@review.list.headline:Reviews`
  },
  {
    path: 'reviews/add',
    component: ReviewAddComponent,
    title: $localize`:@@review.add.headline:Add Review`
  },
  {
    path: 'reviews/edit/:id',
    component: ReviewEditComponent,
    title: $localize`:@@review.edit.headline:Edit Review`
  },
  {
    path: 'flags',
    component: FlagListComponent,
    title: $localize`:@@flag.list.headline:Flags`
  },
  {
    path: 'flags/add',
    component: FlagAddComponent,
    title: $localize`:@@flag.add.headline:Add Flag`
  },
  {
    path: 'flags/edit/:id',
    component: FlagEditComponent,
    title: $localize`:@@flag.edit.headline:Edit Flag`
  },
  {
    path: 'userMedias',
    component: UserMediaListComponent,
    title: $localize`:@@userMedia.list.headline:User Medias`
  },
  {
    path: 'userMedias/add',
    component: UserMediaAddComponent,
    title: $localize`:@@userMedia.add.headline:Add User Media`
  },
  {
    path: 'userMedias/edit/:id',
    component: UserMediaEditComponent,
    title: $localize`:@@userMedia.edit.headline:Edit User Media`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
