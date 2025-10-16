export class FlagDTO {

  constructor(data:Partial<FlagDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  color?: string|null;

}
