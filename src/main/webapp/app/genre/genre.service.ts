import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenreDTO } from 'app/genre/genre.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class GenreService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/genres';

  getAllGenres() {
    return this.http.get<GenreDTO[]>(this.resourcePath);
  }

  getGenre(id: number) {
    return this.http.get<GenreDTO>(this.resourcePath + '/' + id);
  }

  createGenre(genreDTO: GenreDTO) {
    return this.http.post<number>(this.resourcePath, genreDTO);
  }

  updateGenre(id: number, genreDTO: GenreDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, genreDTO);
  }

  deleteGenre(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getMediaTypeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaTypeValues')
        .pipe(map(transformRecordToMap));
  }

}
