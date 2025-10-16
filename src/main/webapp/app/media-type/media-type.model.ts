export class MediaTypeDTO {

  constructor(data:Partial<MediaTypeDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;

}
