import { Component } from '@angular/core';
import { AuthService } from './api/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private api: AuthService) {}
  title = 'app';
}
