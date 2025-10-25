export class MediaDTO {

  constructor(data:Partial<MediaDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  title?: string|null;
  description?: string|null;
  coverUrl?: string|null;
  createdAt?: string|null;
  updatedAt?: string|null;
  mediaType?: {
    id?: number|null;
    name?: string|null;
  }|null;
  genre?: {
    id?: number|null;
    name?: string|null;
  }|null;
  platform?: {
    id?: number|null;
    name?: string|null;
  }|null;
  createdBy?: {
    id?: number|null;
    username?: string|null;
    password?: string|null;
    avatar?: string|null;
    role?: string|null;
    createdAt?: string|null;
    token?: string|null;
  }|null;
  mediaTagTags?: {
    id?: number|null;
    name?: string|null;
  }[]|null;

}
