import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  private getBaseUrl(): string {
    return this.config.get<string>('apiBaseUrl', '/api') || '/api';
  }

  /**
   * Generic HTTP request method supporting all HTTP verbs and options
   * @param method HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)
   * @param endpoint API endpoint path (relative to base URL)
   * @param options Request options including body, headers, params, responseType, withCredentials, observeResponse
   * @returns Observable of the response, or HttpResponse if observeResponse is true
   */
  request<T>(
    method: string,
    endpoint: string,
    options?: {
      body?: any;
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      responseType?: 'json';
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    const url = `${this.getBaseUrl()}${endpoint}`;

    if (options?.observeResponse) {
      return this.http.request<T>(method, url, {
        ...options,
        observe: 'response'
      }) as Observable<HttpResponse<T>>;
    }

    return this.http.request<T>(method, url, options);
  }

  /**
   * GET request helper
   */
  get<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * POST request helper
   */
  post<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    return this.request<T>('POST', endpoint, { body, ...options });
  }

  /**
   * PUT request helper
   */
  put<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    return this.request<T>('PUT', endpoint, { body, ...options });
  }

  /**
   * DELETE request helper
   */
  delete<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * PATCH request helper
   */
  patch<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
      observeResponse?: boolean;
    }
  ): Observable<T | HttpResponse<T>> {
    return this.request<T>('PATCH', endpoint, { body, ...options });
  }
}
