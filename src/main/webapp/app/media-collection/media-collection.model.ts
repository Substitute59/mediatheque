export class MediaCollectionDTO {

  constructor(data:Partial<MediaCollectionDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  position?: number|null;
  type?: string|null;
  media?: number|null;
  collection?: number|null;

}
