import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaTypeDTO } from 'app/media-type/media-type.model';


@Injectable({
  providedIn: 'root',
})
export class MediaTypeService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/mediaTypes';

  getAllMediaTypes() {
    return this.http.get<MediaTypeDTO[]>(this.resourcePath);
  }

  getMediaType(id: number) {
    return this.http.get<MediaTypeDTO>(this.resourcePath + '/' + id);
  }

  createMediaType(mediaTypeDTO: MediaTypeDTO) {
    return this.http.post<number>(this.resourcePath, mediaTypeDTO);
  }

  updateMediaType(id: number, mediaTypeDTO: MediaTypeDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, mediaTypeDTO);
  }

  deleteMediaType(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
