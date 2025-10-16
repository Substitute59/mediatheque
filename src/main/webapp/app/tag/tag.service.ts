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

  getAllTags() {
    return this.http.get<TagDTO[]>(this.resourcePath);
  }

  getTag(id: number) {
    return this.http.get<TagDTO>(this.resourcePath + '/' + id);
  }

  createTag(tagDTO: TagDTO) {
    return this.http.post<number>(this.resourcePath, tagDTO);
  }

  updateTag(id: number, tagDTO: TagDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, tagDTO);
  }

  deleteTag(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
