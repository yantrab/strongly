import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/comonent.module';
import { RouterModule, Routes } from '@angular/router';
import { User } from '../api/models/user';
import { AuthService } from '../auth/auth.service';
import { Guard } from '../guard';
@Component({
  selector: 'app-root',
  template: `
    <div fxLayout="column" fxFlexFill>
      <mat-toolbar>
        <a mat-button>Some page</a>
        <a mat-button routerLink="admin">admin</a>
        <span style="flex: 1 1 auto;"></span>
        <span> Hello {{ user?.fName }} {{ user?.lName }}</span>
        <a (click)="logout()" mat-button>logout</a>
      </mat-toolbar>
      <div fxFlex style="padding: 1%;">
        <router-outlet
          style="flex: 1 1 auto;
          display: flex;
          overflow: hidden;"
        ></router-outlet>
      </div>
    </div>
  `
})
class MainComponent {
  user?: User;

  constructor(private authService: AuthService) {
    authService.user$.subscribe(user => (this.user = user));
  }
  logout() {
    this.authService.logout().subscribe(() => {});
  }
}

@NgModule({
  declarations: [MainComponent],
  imports: [
    ComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
        children: [{ path: 'admin', loadChildren: () => import('src/app/main/admin/admin.module').then(m => m.AdminModule) }]
      }
    ])
  ]
})
export class MainModule {}
