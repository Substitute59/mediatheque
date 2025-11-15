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

  createPlatform(platformDTO: PlatformDTO) {
    return this.http.post<number>(this.resourcePath, platformDTO);
  }
}
