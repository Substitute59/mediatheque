export class PlatformDTO {

  constructor(data:Partial<PlatformDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;

}
