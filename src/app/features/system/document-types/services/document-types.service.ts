import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getDocumentTypes(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<DocumentType>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<DocumentType>>('/admin/document-types', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<DocumentType> : response as PaginatedResponse<DocumentType>)
    );
  }

  getDocumentTypeById(id: string): Observable<DocumentType> {
    return this.api.get<DocumentType>(`/admin/document-types/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as DocumentType : response as DocumentType)
    );
  }

  createDocumentType(data: Partial<DocumentType>): Observable<DocumentType> {
    return this.api.post<DocumentType>('/admin/document-types', data).pipe(
      map(response => response instanceof HttpResponse ? response.body as DocumentType : response as DocumentType)
    );
  }

  updateDocumentType(id: string, data: Partial<DocumentType>): Observable<DocumentType> {
    return this.api.put<DocumentType>(`/admin/document-types/${id}`, data).pipe(
      map(response => response instanceof HttpResponse ? response.body as DocumentType : response as DocumentType)
    );
  }

  deleteDocumentType(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/document-types/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
