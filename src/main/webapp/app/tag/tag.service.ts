import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TagDTO } from 'app/tag/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/tags';

  createTags(tags: TagDTO[]) {
    return this.http.post<number[]>(this.resourcePath, tags);
  }
}
