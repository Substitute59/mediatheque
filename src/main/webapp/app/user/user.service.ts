import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  resourcePath = environment.apiPath + '/api/users';

  constructor(private http: HttpClient) {}

  updateUser(id: number, user: FormData) {
    return this.http.put<number>(this.resourcePath + '/' + id, user);
  }
}
