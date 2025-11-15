import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { GenreDTO } from 'app/genre/genre.model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/genres';

  getAllGenres() {
    return this.http.get<GenreDTO[]>(this.resourcePath);
  }

  createGenre(genreDTO: GenreDTO) {
    return this.http.post<number>(this.resourcePath, genreDTO);
  }
}
