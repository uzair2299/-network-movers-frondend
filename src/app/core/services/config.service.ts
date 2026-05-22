import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  appName?: string;
  apiBaseUrl?: string;
  authBaseUrl?: string;
  enableLogs?: boolean;
  version?: string;
[key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = {};

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    const url = '/assets/config/config.json';
    return firstValueFrom(this.http.get<AppConfig>(url))
      .then(cfg => {
        this.config = cfg || {};
        if (this.config.enableLogs) {
          // optional: surface appName in console for easier debugging
          // eslint-disable-next-line no-console
          console.info(`Loaded config for ${this.config.appName || 'app'}`);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Failed to load runtime config', err);
        this.config = {};
      });
  }

  get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (this.config && Object.prototype.hasOwnProperty.call(this.config, key)) {
      return this.config[key] as T;
    }
    return defaultValue;
  }

  getAll(): AppConfig {
    return this.config;
  }
}
