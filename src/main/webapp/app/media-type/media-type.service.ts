import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaTypeDTO } from './media-type.model';

@Injectable({
  providedIn: 'root',
})
export class MediaTypeService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/mediaTypes';

  getAllMediaTypes(userId: number) {
    return this.http.get<MediaTypeDTO[]>(this.resourcePath + '?userId=' + userId);
  }
}
