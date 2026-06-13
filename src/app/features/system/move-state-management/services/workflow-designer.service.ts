import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MoveStatus, MoveStatusTransition } from '../models/workflow-designer.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowDesignerService {
  private baseUrl = 'https://network-movers-backend-production.up.railway.app/api/v1/admin';

  constructor(private http: HttpClient) {}

  getWorkflow(): Observable<{ nodes: any[]; transitions: MoveStatusTransition[] }> {
    return this.http.get<any>(`${this.baseUrl}/move-status-transitions`).pipe(
      map(res => {
        return {
          nodes: res?.nodes || [],
          transitions: res?.transitions || []
        };
      })
    );
  }

  saveWorkflow(payload: { nodes: any[]; transitions: any[] }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/move-status-transitions`, payload);
  }

}
