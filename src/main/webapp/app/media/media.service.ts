import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaDTO } from 'app/media/media.model';


@Injectable({
  providedIn: 'root',
})
export class MediaService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/medias';

  getAllMedias() {
    return this.http.get<MediaDTO[]>(this.resourcePath);
  }

  getMedia(id: number) {
    return this.http.get<MediaDTO>(this.resourcePath + '/' + id);
  }

  createMedia(mediaDTO: MediaDTO) {
    return this.http.post<number>(this.resourcePath, mediaDTO);
  }

  updateMedia(id: number, mediaDTO: MediaDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, mediaDTO);
  }

  deleteMedia(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
