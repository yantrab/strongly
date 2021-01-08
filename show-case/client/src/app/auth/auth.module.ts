import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/comonent.module';
import { LoginComponent } from './login.compnent';
import { RouterModule } from '@angular/router';
@Component({ selector: 'app-root', template: '<router-outlet></router-outlet>' })
class AuthComponent {}
@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [ComponentModule, RouterModule.forChild([{ path: 'login', component: LoginComponent }])],
  providers: [],
  bootstrap: []
})
export class AuthModule {}
