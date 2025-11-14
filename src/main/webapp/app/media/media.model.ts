export class MediaDTO {

  constructor(data?: Partial<MediaDTO>) {
    Object.assign(this, data);
  }

  id?: number | null;
  title?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  addedDate?: string | null;

  flag?: {
    id?: number | null;
    name?: string | null;
    color?: string | null;
  } | null;

  mediaType?: {
    id?: number | null;
    name?: string | null;
    icon?: string | null;
    numberOfMedias?: number | null;
  } | null;

  genre?: {
    id?: number | null;
    name?: string | null;
    mediaType?: any | null;
  } | null;

  platform?: {
    id?: number | null;
    name?: string | null;
  } | null;

  createdBy?: {
    id?: number | null;
    username?: string | null;
    password?: string | null;
    avatar?: string | null;
    refreshToken?: string | null;
    role?: string | null;
    createdAt?: string | null;
  } | null;

  mediaTagTags?: {
    id?: number | null;
    name?: string | null;
  }[] | null;

  mediaMediaArtists?: {
    id?: number | null;
    name?: string | null;
    type?: string | null;
  }[] | null;

  mediaCollections?: {
    id?: number | null;
    name?: string | null;
  }[] | null;

  mediaMediaCollections?: {
    id?: number | null;
    type?: string | null;
    position?: number | null;
  }[] | null;

  mediaReviews?: {
    id?: number | null;
    rating?: number | null;
    comment?: string | null;
    createdAt?: string | null;
    media?: any | null;
    user?: number | null;
  }[] | null;

  inUserMediaLibrary?: boolean | null;

  userMediaId?: number | null;

}
