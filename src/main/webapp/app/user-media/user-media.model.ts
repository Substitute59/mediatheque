export class UserMediaDTO {

  constructor(data:Partial<UserMediaDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  personalNotes?: string|null;
  user?: number|null;
  media?: number|null;
  flag?: number|null;

}
