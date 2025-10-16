export class UserDTO {

  constructor(data:Partial<UserDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  username?: string|null;
  password?: string|null;
  role?: string|null;
  createdAt?: string|null;

}
