import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ReviewDTO } from 'app/review/review.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/reviews';

  getAllReviews() {
    return this.http.get<ReviewDTO[]>(this.resourcePath);
  }

  getReview(id: number) {
    return this.http.get<ReviewDTO>(this.resourcePath + '/' + id);
  }

  createReview(reviewDTO: ReviewDTO) {
    return this.http.post<number>(this.resourcePath, reviewDTO);
  }

  updateReview(id: number, reviewDTO: ReviewDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, reviewDTO);
  }

  deleteReview(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getMediaValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaValues')
        .pipe(map(transformRecordToMap));
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

}
