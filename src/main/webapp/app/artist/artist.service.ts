import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ArtistDTO } from 'app/artist/artist.model';


@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/artists';

  getAllArtists() {
    return this.http.get<ArtistDTO[]>(this.resourcePath);
  }

  getArtist(id: number) {
    return this.http.get<ArtistDTO>(this.resourcePath + '/' + id);
  }

  createArtist(artistDTO: ArtistDTO) {
    return this.http.post<number>(this.resourcePath, artistDTO);
  }

  updateArtist(id: number, artistDTO: ArtistDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, artistDTO);
  }

  deleteArtist(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
