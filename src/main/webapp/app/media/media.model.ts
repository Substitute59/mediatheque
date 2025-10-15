export class MediaDTO {

  constructor(data:Partial<MediaDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  title?: string|null;
  type?: string|null;

}
