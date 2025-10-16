export class ReviewDTO {

  constructor(data:Partial<ReviewDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  rating?: number|null;
  comment?: string|null;
  createdAt?: string|null;
  media?: number|null;
  user?: number|null;

}
