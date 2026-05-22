import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { routes } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }), CoreModule, SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
