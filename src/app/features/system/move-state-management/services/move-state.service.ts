import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MovePhaseRequest, MovePhaseResponse, MoveStatusRequest, MoveStatusResponse } from '../models/move-state.model';

@Injectable({
  providedIn: 'root'
})
export class MoveStateService {
  private baseUrl = 'https://network-movers-backend-production.up.railway.app/api/v1/admin';

  constructor(private http: HttpClient) {}

  // --- PHASES ---
  getPhases(): Observable<MovePhaseResponse[]> {
    return this.http.get<{content: MovePhaseResponse[]}>(`${this.baseUrl}/move-phase`).pipe(
      map(res => (res.content || []).sort((a, b) => a.sequenceNo - b.sequenceNo))
    );
  }

  createPhase(request: MovePhaseRequest): Observable<MovePhaseResponse> {
    return this.http.post<MovePhaseResponse>(`${this.baseUrl}/move-phase`, request);
  }

  updatePhase(id: string, request: MovePhaseRequest): Observable<MovePhaseResponse> {
    return this.http.put<MovePhaseResponse>(`${this.baseUrl}/move-phase/${id}`, request);
  }

  deletePhase(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/move-phase/${id}`);
  }

  // --- STATUSES ---
  getStatusesByPhaseId(phaseId: string): Observable<MoveStatusResponse[]> {
    return this.http.get<{content: MoveStatusResponse[]}>(`${this.baseUrl}/move-status`, { params: { phaseId } }).pipe(
      map(res => (res.content || [])
        .filter(s => s.phase && s.phase.id === phaseId)
        .sort((a, b) => a.sequenceNo - b.sequenceNo)
      )
    );
  }

  createStatus(request: MoveStatusRequest): Observable<MoveStatusResponse> {
    return this.http.post<MoveStatusResponse>(`${this.baseUrl}/move-status`, request);
  }

  updateStatus(id: string, request: MoveStatusRequest): Observable<MoveStatusResponse> {
    return this.http.put<MoveStatusResponse>(`${this.baseUrl}/move-status/${id}`, request);
  }

  deleteStatus(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/move-status/${id}`);
  }
}
