import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PlatformDTO } from 'app/platform/platform.model';


@Injectable({
  providedIn: 'root',
})
export class PlatformService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/platforms';

  getAllPlatforms() {
    return this.http.get<PlatformDTO[]>(this.resourcePath);
  }

  getPlatform(id: number) {
    return this.http.get<PlatformDTO>(this.resourcePath + '/' + id);
  }

  createPlatform(platformDTO: PlatformDTO) {
    return this.http.post<number>(this.resourcePath, platformDTO);
  }

  updatePlatform(id: number, platformDTO: PlatformDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, platformDTO);
  }

  deletePlatform(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
