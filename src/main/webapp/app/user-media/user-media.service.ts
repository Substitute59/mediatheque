import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserMediaDTO } from 'app/user-media/user-media.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class UserMediaService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/userMedias';

  getAllUserMedias() {
    return this.http.get<UserMediaDTO[]>(this.resourcePath);
  }

  getUserMedia(id: number) {
    return this.http.get<UserMediaDTO>(this.resourcePath + '/' + id);
  }

  createUserMedia(userMediaDTO: UserMediaDTO) {
    return this.http.post<number>(this.resourcePath, userMediaDTO);
  }

  updateUserMedia(id: number, userMediaDTO: UserMediaDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, userMediaDTO);
  }

  deleteUserMedia(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

  getMediaValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/mediaValues')
        .pipe(map(transformRecordToMap));
  }

  getFlagValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/flagValues')
        .pipe(map(transformRecordToMap));
  }

}
