export class CollectionDTO {

  constructor(data:Partial<CollectionDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  description?: string|null;

}
