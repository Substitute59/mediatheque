import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MediaArtistDTO } from 'app/media-artist/media-artist.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class MediaArtistService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/mediaArtists';

  getAllMediaArtists() {
    return this.http.get<MediaArtistDTO[]>(this.resourcePath);
  }

  getMediaArtist(id: number) {
    return this.http.get<MediaArtistDTO>(this.resourcePath + '/' + id);
  }

  createMediaArtist(mediaArtistDTO: MediaArtistDTO) {
    return this.http.post<number>(this.resourcePath, mediaArtistDTO);
  }

  updateMediaArtist(id: number, mediaArtistDTO: MediaArtistDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, mediaArtistDTO);
  }

  deleteMediaArtist(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getMediaValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaValues')
        .pipe(map(transformRecordToMap));
  }

  getArtistValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/artistValues')
        .pipe(map(transformRecordToMap));
  }

}
