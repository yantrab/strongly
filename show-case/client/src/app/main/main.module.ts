import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/comonent.module';
import { RouterModule } from '@angular/router';
import { User } from '../api/models/user';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar>
      <a mat-button>Some page</a>
      <a mat-button>admin</a>
      <span style="flex: 1 1 auto;"></span>
      <span> Hello {{ user?.fName }} {{ user?.lName }}</span>
      <a (click)="logout()" mat-button>logout</a>
    </mat-toolbar>
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
        component: MainComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule {}
