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
  mediaType?: number|null;
  genre?: number|null;
  platform?: number|null;
  flag?: number|null;
  createdBy?: number|null;
  mediaTagTags?: number[]|null;

}
