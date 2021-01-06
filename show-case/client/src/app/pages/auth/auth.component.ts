import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService, loginFormGroupType } from '../../api/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor(private service: AuthService) {}
  loginFormGroup = this.service.loginFormGroup();

  login() {
    if (!this.loginFormGroup?.value) return;
    this.service.login(this.loginFormGroup.value).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }
}
