import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DocumentType } from '../models/document-type.model';
import { ApiService } from '../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService {
  constructor(private api: ApiService) {}

  getDocumentTypes(page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Observable<PaginatedResponse<DocumentType>> {
    return this.api.get<PaginatedResponse<DocumentType>>('/admin/document-types', {
      params: { page: page.toString(), size: size.toString(), sort }
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<DocumentType> : response as PaginatedResponse<DocumentType>)
    );
  }

  getDocumentTypeById(id: string): Observable<DocumentType> {
    return this.api.get<DocumentType>(`/admin/document-types/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as DocumentType : response as DocumentType)
    );
  }
}
