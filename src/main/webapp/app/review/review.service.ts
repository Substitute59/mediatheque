import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ReviewDTO } from 'app/review/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/reviews';

  createReview(reviewDTO: ReviewDTO) {
    return this.http.post<number>(this.resourcePath, reviewDTO);
  }
}
