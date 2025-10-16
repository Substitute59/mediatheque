import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CollectionDTO } from 'app/collection/collection.model';


@Injectable({
  providedIn: 'root',
})
export class CollectionService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/collections';

  getAllCollections() {
    return this.http.get<CollectionDTO[]>(this.resourcePath);
  }

  getCollection(id: number) {
    return this.http.get<CollectionDTO>(this.resourcePath + '/' + id);
  }

  createCollection(collectionDTO: CollectionDTO) {
    return this.http.post<number>(this.resourcePath, collectionDTO);
  }

  updateCollection(id: number, collectionDTO: CollectionDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, collectionDTO);
  }

  deleteCollection(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
