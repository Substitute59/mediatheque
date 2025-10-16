export class ArtistDTO {

  constructor(data:Partial<ArtistDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  type?: string|null;

}
