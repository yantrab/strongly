import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/comonent.module';
import { LoginComponent } from './login.compnent';
import { RouterModule } from '@angular/router';
import { SetPasswordComponent } from './set-password.compnent';
@Component({ selector: 'app-root', template: '<router-outlet></router-outlet>' })
class AuthComponent {}
@NgModule({
  declarations: [AuthComponent, LoginComponent, SetPasswordComponent],
  imports: [
    ComponentModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'change-password', component: SetPasswordComponent }
    ])
  ],
  providers: [],
  bootstrap: []
})
export class AuthModule {}
