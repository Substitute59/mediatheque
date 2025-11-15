import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaDTO } from './media.model';
import { map } from 'rxjs';
import { transformRecordToArray } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/medias';

  getAllMedias(userId: number = 0) {
    const url = userId === 0 ? this.resourcePath : this.resourcePath + '?userId=' + userId;
    return this.http.get<MediaDTO[]>(url);
  }

  getMedia(id: number, userId: number = 0) {
    const url = userId === 0 ? this.resourcePath + '/' + id : this.resourcePath + '/' + id + '?userId=' + userId;
    return this.http.get<MediaDTO>(url);
  }

  createMedia(mediaDTO: MediaDTO, file?: File) {
    const formData = new FormData();
    formData.append('media', new Blob([JSON.stringify(mediaDTO)], { type: 'application/json' }));
    if (file) {
      formData.append('cover', file);
    }
    return this.http.post<number>(this.resourcePath, formData);
  }

  updateMedia(id: number, mediaDTO: MediaDTO, file?: File) {
    const formData = new FormData();
    formData.append("media", new Blob([JSON.stringify(mediaDTO)], { type: "application/json" }));
    if (file) {
      formData.append("cover", file);
    }
    return this.http.put<void>(`${this.resourcePath}/${id}`, formData);
  }

  deleteMedia(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getMediaTypeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaTypeValues')
        .pipe(map(transformRecordToArray));
  }

  getGenreValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/genreValues')
        .pipe(map(transformRecordToArray));
  }

  getPlatformValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/platformValues')
        .pipe(map(transformRecordToArray));
  }

  getMediaTagTagsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaTagTagsValues')
        .pipe(map(transformRecordToArray));
  }

  getMediaMediaArtistsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaMediaArtistsValues')
        .pipe(map(transformRecordToArray));
  }

  getMediaMediaCollectionsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaMediaCollectionsValues')
        .pipe(map(transformRecordToArray));
  }
}
