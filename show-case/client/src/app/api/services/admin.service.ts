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

import { User, UserSchema } from '../models/user';

export declare type addUserFormGroupType = FormGroupTypeSafe<User>;

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private ajv: Ajv, private fb: FormBuilderTypeSafe) {
    super(config, http);
  }

  /**
   * Path part for operation users
   */
  static readonly UsersPath = '/admin/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `users()` instead.
   *
   * This method doesn't expect any request body.
   */
  users$Response(): Observable<StrictHttpResponse<Array<User>>> {
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

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `users$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  users(): Observable<Array<User>> {
    return this.users$Response().pipe(map((r: StrictHttpResponse<Array<User>>) => r.body as Array<User>));
  }

  /**
   * Path part for operation addUser
   */
  static readonly AddUserPath = '/admin/add-user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addUser$Response(params: User): Observable<StrictHttpResponse<void>> {
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

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addUser(params: User): Observable<void> {
    return this.addUser$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
  addUserFormGroup(value?: User) {
    let schema: any = { $ref: '#/components/schemas/User' };
    if (schema.ref) {
      schema = this.ajv.getSchema(schema.ref);
    }
    const validate = this.ajv.compile(schema);
    const formControls: any = {};
    const keys = Object.keys(schema.properties);
    for (const key of keys) {
      // @ts-ignore
      formControls[key] = new FormControl((value && value[key]) || '');
    }
    return this.fb.group<User>(formControls as any, {
      validators: [
        (formGroup: FormGroupTypeSafe<User>) => {
          const isValid = validate(formGroup.value);
          if (isValid) return null;
          const result: any = {};
          const errors = validate.errors;
          errors?.forEach(error => {
            const key = error.dataPath.replace('/', '');
            result[key] = error.message;
            formControls[key].setErrors([error.message]);
          });
          return result;
        }
      ]
    });
  }
}
