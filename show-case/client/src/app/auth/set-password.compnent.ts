import { Component } from '@angular/core';
import { AuthService, SetPasswordFormGroupType } from '../api/services/auth.service';
import { FormModel } from 'swagular';

@Component({ selector: 'app-login', templateUrl: './auth.component.html', styleUrls: ['./auth.component.scss'] })
export class SetPasswordComponent {
  loginError?: string;
  model: FormModel<SetPasswordFormGroupType> = {
    formGroup: this.service.setPasswordFormGroup(),
    formTitle: 'Change password',
    formSaveButtonTitle: 'Save',
    fields: [{ key: 'email' }, { key: 'password', type: 'password' }, { key: 'rePassword', type: 'password' }]
  };
  constructor(private service: AuthService) {}

  login() {
    this.service.setPassword({ token: '', body: this.model.formGroup.value }).subscribe(
      res => {
        console.log(res);
      },
      error => {
        this.loginError = 'user or password is incorrect';
        console.log(error);
      }
    );
  }
}
