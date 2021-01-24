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

export declare type saveOrUpdateUserFormGroupType = User;

export declare type deleteUserFormGroupType = User;

export declare type unDeleteUserFormGroupType = User;

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  /**
   * Path part for operation users
   */
  static readonly UsersPath = '/admin/users';
  /**
   * Path part for operation saveOrUpdateUser
   */
  static readonly SaveOrUpdateUserPath = '/admin/save-or-update-user';
  /**
   * Path part for operation deleteUser
   */
  static readonly DeleteUserPath = '/admin/delete-user';
  /**
   * Path part for operation unDeleteUser
   */
  static readonly UnDeleteUserPath = '/admin/un-delete-user';

  constructor(config: ApiConfiguration, http: HttpClient, ajv: Ajv, fb: FormBuilderTypeSafe) {
    super(config, http, ajv, fb);
  }
  users(): Observable<Array<User>> {
    return this.users$Response().pipe(map((r: StrictHttpResponse<Array<User>>) => r.body as Array<User>));
  }

  saveOrUpdateUser(params: User): Observable<User> {
    return this.saveOrUpdateUser$Response(params).pipe(map((r: StrictHttpResponse<User>) => r.body as User));
  }

  deleteUser(params: User): Observable<User> {
    return this.deleteUser$Response(params).pipe(map((r: StrictHttpResponse<User>) => r.body as User));
  }

  unDeleteUser(params: User): Observable<User> {
    return this.unDeleteUser$Response(params).pipe(map((r: StrictHttpResponse<User>) => r.body as User));
  }

  saveOrUpdateUserFormGroup(value?: User) {
    const schema: any = UserSchema;
    return this.getFormGroup<User>(schema, value);
  }

  saveOrUpdateUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof User & string)[] }, value?: User) {
    const schema: any = UserSchema;
    return this.getFormModel<User>(schema, options, value);
  }

  deleteUserFormGroup(value?: User) {
    const schema: any = UserSchema;
    return this.getFormGroup<User>(schema, value);
  }

  deleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof User & string)[] }, value?: User) {
    const schema: any = UserSchema;
    return this.getFormModel<User>(schema, options, value);
  }

  unDeleteUserFormGroup(value?: User) {
    const schema: any = UserSchema;
    return this.getFormGroup<User>(schema, value);
  }

  unDeleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof User & string)[] }, value?: User) {
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

  private saveOrUpdateUser$Response(params: User): Observable<StrictHttpResponse<User>> {
    const rb = new RequestBuilder(this.rootUrl, AdminService.SaveOrUpdateUserPath, 'post');
    rb.body(params, 'application/json');
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
          return r as StrictHttpResponse<User>;
        })
      );
  }

  private deleteUser$Response(params: User): Observable<StrictHttpResponse<User>> {
    const rb = new RequestBuilder(this.rootUrl, AdminService.DeleteUserPath, 'post');
    rb.body(params, 'application/json');
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
          return r as StrictHttpResponse<User>;
        })
      );
  }

  private unDeleteUser$Response(params: User): Observable<StrictHttpResponse<User>> {
    const rb = new RequestBuilder(this.rootUrl, AdminService.UnDeleteUserPath, 'post');
    rb.body(params, 'application/json');
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
          return r as StrictHttpResponse<User>;
        })
      );
  }
}
