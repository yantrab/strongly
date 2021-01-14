import { Component } from '@angular/core';
import { AuthService, loginFormGroupType } from '../api/services/auth.service';
import { FormModel } from '../components/form/form.component';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class SetPasswordComponent {
  loginError?: string;
  model: FormModel<loginFormGroupType & { rePassword: string }> = {
    formGroup: this.service.loginFormGroup(),
    formTitle: 'Login Form',
    formSaveButtonTitle: 'Login',
    fields: [{ key: 'email' }, { key: 'password', type: 'password' }, { key: 'rePassword', type: 'password' }]
  };
  constructor(private service: AuthService) {}

  login() {
    this.service.(this.model.formGroup.value).subscribe(
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
