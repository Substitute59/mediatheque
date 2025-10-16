export class GenreDTO {

  constructor(data:Partial<GenreDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  mediaType?: number|null;

}
