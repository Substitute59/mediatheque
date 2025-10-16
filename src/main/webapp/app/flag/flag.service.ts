import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FlagDTO } from 'app/flag/flag.model';


@Injectable({
  providedIn: 'root',
})
export class FlagService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/flags';

  getAllFlags() {
    return this.http.get<FlagDTO[]>(this.resourcePath);
  }

  getFlag(id: number) {
    return this.http.get<FlagDTO>(this.resourcePath + '/' + id);
  }

  createFlag(flagDTO: FlagDTO) {
    return this.http.post<number>(this.resourcePath, flagDTO);
  }

  updateFlag(id: number, flagDTO: FlagDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, flagDTO);
  }

  deleteFlag(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
