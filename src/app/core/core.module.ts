import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { JwtService } from './auth/jwt.service';
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';
import { LoggerService } from './services/logger.service';

export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

@NgModule({
  providers: [
    ConfigService,
    LoggerService,
    AuthService,
    JwtService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
