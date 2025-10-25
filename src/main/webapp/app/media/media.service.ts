import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaDTO } from 'app/media/media.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


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

  getMediaTypeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaTypeValues')
        .pipe(map(transformRecordToMap));
  }

  getGenreValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/genreValues')
        .pipe(map(transformRecordToMap));
  }

  getPlatformValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/platformValues')
        .pipe(map(transformRecordToMap));
  }

  getCreatedByValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/createdByValues')
        .pipe(map(transformRecordToMap));
  }

  getMediaTagTagsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaTagTagsValues')
        .pipe(map(transformRecordToMap));
  }

}
