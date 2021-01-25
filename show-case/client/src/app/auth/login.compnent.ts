import { Component } from '@angular/core';
import { AuthService, LoginFormGroupType } from '../api/services/auth.service';
import { FormModel } from '../components/form/form.component';
import { Router } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './auth.component.html', styleUrls: ['./auth.component.scss'] })
export class LoginComponent {
  loginError?: string;
  model: FormModel<LoginFormGroupType> = {
    formGroup: this.service.loginFormGroup(),
    formTitle: 'Login Form',
    formSaveButtonTitle: 'Login',
    fields: [{ key: 'email' }, { key: 'password', type: 'password' }]
  };
  constructor(private service: AuthService, private router: Router) {}

  login() {
    this.service.login(this.model.formGroup.value).subscribe(
      user => {
        this.router.navigate(['']).catch(console.log);
      },
      error => {
        this.loginError = 'user or password is incorrect';
        console.log(error);
      }
    );
  }
}
