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

export declare type loginFormGroupType = FormGroupTypeSafe<{ password: string; email: any & any }>;

/**
 * User authentication stuff
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private ajv: Ajv, private fb: FormBuilderTypeSafe) {
    super(config, http);
  }

  /**
   * Path part for operation login
   */
  static readonly LoginPath = '/auth/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */

  login$Response(params: { password: string; email: any & any }): Observable<StrictHttpResponse<User>> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.LoginPath, 'post');
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

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(params: { password: string; email: any & any }): Observable<User> {
    return this.login$Response(params).pipe(map((r: StrictHttpResponse<User>) => r.body as User));
  }
  loginFormGroup(value?: { password: string; email: any & any }) {
    let schema: any = {
      properties: {
        password: { type: 'string', minLength: 6 },
        email: { format: 'email', type: 'string', allOf: [{ transform: ['trim'] }, { minLength: 1 }] }
      },
      type: 'object',
      required: ['password', 'email']
    };
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
    return this.fb.group<{ password: string; email: any & any }>(formControls as any, {
      validators: [
        (formGroup: FormGroupTypeSafe<{ password: string; email: any & any }>) => {
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

  /**
   * Path part for operation logout
   */
  static readonly LogoutPath = '/auth/logout';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `logout()` instead.
   *
   * This method doesn't expect any request body.
   */
  logout$Response(): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.LogoutPath, 'post');
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
   * To access the full response (for headers, for example), `logout$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  logout(): Observable<void> {
    return this.logout$Response().pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation getUserAuthenticated
   */
  static readonly GetUserAuthenticatedPath = '/auth/get-user-authenticated';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserAuthenticated()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserAuthenticated$Response(): Observable<StrictHttpResponse<User>> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.GetUserAuthenticatedPath, 'get');
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

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAuthenticated$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserAuthenticated(): Observable<User> {
    return this.getUserAuthenticated$Response().pipe(map((r: StrictHttpResponse<User>) => r.body as User));
  }
}
