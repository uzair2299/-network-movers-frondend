import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './pages/login.page';

@NgModule({
  declarations: [LoginPage],
  imports: [SharedModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
