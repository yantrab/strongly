import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import Ajv from 'ajv';
import { FormBuilderTypeSafe, FormGroupTypeSafe } from 'angular-typesafe-reactive-forms-helper';
import { FormControl } from '@angular/forms';
import { FormModel } from '../../components/form/form.component';
import { User, UserSchema } from '../models/user';

export declare type addUserFormGroupType = User;

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  /**
   * Path part for operation users
   */
  static readonly UsersPath = '/admin/users';
  /**
   * Path part for operation addUser
   */
  static readonly AddUserPath = '/admin/add-user';

  constructor(config: ApiConfiguration, http: HttpClient, ajv: Ajv, fb: FormBuilderTypeSafe) {
    super(config, http, ajv, fb);
  }
  users(): Observable<Array<User>> {
    return this.users$Response().pipe(map((r: StrictHttpResponse<Array<User>>) => r.body as Array<User>));
  }

  addUser(params: User): Observable<void> {
    return this.addUser$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  addUserFormGroup(value?: User) {
    const schema: any = UserSchema;
    return this.getFormGroup<User>(schema, value);
  }

  addUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof User & string)[] }, value?: User) {
    const schema: any = UserSchema;
    return this.getFormModel<User>(schema, options, value);
  }

  private users$Response(): Observable<StrictHttpResponse<Array<User>>> {
    const rb = new RequestBuilder(this.rootUrl, AdminService.UsersPath, 'get');
    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Array<User>>;
        })
      );
  }

  private addUser$Response(params: User): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AdminService.AddUserPath, 'post');
    rb.body(params, 'application/json');
    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }
}
