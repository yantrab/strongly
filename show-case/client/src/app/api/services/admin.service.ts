import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import Ajv from 'ajv';
import { FormBuilderTypeSafe } from 'angular-typesafe-reactive-forms-helper';
import { FormModel } from '../../components/form/form.component';
import { User, UserSchema } from '../models/user';

  
    export declare type SaveOrUpdateUserFormGroupType = User
    export const saveOrUpdateUserFormGroupSchema = UserSchema;

    export declare type DeleteUserFormGroupType = User
    export const deleteUserFormGroupSchema = UserSchema;

    export declare type UnDeleteUserFormGroupType = User
    export const unDeleteUserFormGroupSchema = UserSchema;


@Injectable({
  providedIn: 'root',
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

  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    ajv: Ajv,
    fb: FormBuilderTypeSafe
  ) {
    super(config, http, ajv, fb);
  }
  users(
): Observable<Array<User>> {
    return this.users$Response( ).pipe(
      map((r: StrictHttpResponse<Array<User>>) => r.body as Array<User>)
    );
  }

  saveOrUpdateUser(      params:  User

): Observable<User> {
    return this.saveOrUpdateUser$Response( params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  deleteUser(      params:  User

): Observable<User> {
    return this.deleteUser$Response( params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  unDeleteUser(      params:  User

): Observable<User> {
    return this.unDeleteUser$Response( params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  
     saveOrUpdateUserFormGroup(value?:SaveOrUpdateUserFormGroupType) {
    return this.getFormGroup<SaveOrUpdateUserFormGroupType>(saveOrUpdateUserFormGroupSchema, value);
  }

   saveOrUpdateUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof SaveOrUpdateUserFormGroupType & string)[] }, value?: SaveOrUpdateUserFormGroupType) {
    return this.getFormModel<SaveOrUpdateUserFormGroupType>(saveOrUpdateUserFormGroupSchema, options, value);
  }

     deleteUserFormGroup(value?:DeleteUserFormGroupType) {
    return this.getFormGroup<DeleteUserFormGroupType>(deleteUserFormGroupSchema, value);
  }

   deleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof DeleteUserFormGroupType & string)[] }, value?: DeleteUserFormGroupType) {
    return this.getFormModel<DeleteUserFormGroupType>(deleteUserFormGroupSchema, options, value);
  }

     unDeleteUserFormGroup(value?:UnDeleteUserFormGroupType) {
    return this.getFormGroup<UnDeleteUserFormGroupType>(unDeleteUserFormGroupSchema, value);
  }

   unDeleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof UnDeleteUserFormGroupType & string)[] }, value?: UnDeleteUserFormGroupType) {
    return this.getFormModel<UnDeleteUserFormGroupType>(unDeleteUserFormGroupSchema, options, value);
  }

private users$Response(
): Observable<StrictHttpResponse<Array<User>>> {

    const rb = new RequestBuilder(this.rootUrl, AdminService.UsersPath, 'get');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<User>>;
      })
    );
  }

private saveOrUpdateUser$Response(      params:  User

): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, AdminService.SaveOrUpdateUserPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

private deleteUser$Response(      params:  User

): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, AdminService.DeleteUserPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

private unDeleteUser$Response(      params:  User

): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, AdminService.UnDeleteUserPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

}
