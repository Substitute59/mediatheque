import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaCollectionDTO } from 'app/media-collection/media-collection.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class MediaCollectionService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/mediaCollections';

  getAllMediaCollections() {
    return this.http.get<MediaCollectionDTO[]>(this.resourcePath);
  }

  getMediaCollection(id: number) {
    return this.http.get<MediaCollectionDTO>(this.resourcePath + '/' + id);
  }

  createMediaCollection(mediaCollectionDTO: MediaCollectionDTO) {
    return this.http.post<number>(this.resourcePath, mediaCollectionDTO);
  }

  updateMediaCollection(id: number, mediaCollectionDTO: MediaCollectionDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, mediaCollectionDTO);
  }

  deleteMediaCollection(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getMediaValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaValues')
        .pipe(map(transformRecordToMap));
  }

  getCollectionValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/collectionValues')
        .pipe(map(transformRecordToMap));
  }

}
