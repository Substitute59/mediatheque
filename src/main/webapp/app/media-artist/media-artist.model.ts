export class MediaArtistDTO {

  constructor(data:Partial<MediaArtistDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  role?: string|null;
  media?: number|null;
  artist?: number|null;

}
