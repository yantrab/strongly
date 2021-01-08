/* tslint:disable */
/* eslint-disable */
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
import { FormControl } from "@angular/forms";



  export declare type login_1FormGroupType = FormGroupTypeSafe<{ 'password': string, 'email': string }>

  
  export declare type notEmptyStringFormGroupType = FormGroupTypeSafe<{ 'str'?: string }>



/**
 * User authentication stuff
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    private ajv: Ajv,
    private fb: FormBuilderTypeSafe
  ) {
    super(config, http);
  }

  /**
   * Path part for operation login_1
   */
  static readonly Login_1Path = '/auth/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login_1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login_1$Response(      params:  { 'password': string, 'email': string }

): Observable<StrictHttpResponse<{ 'fName': string, 'lName': string }>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.Login_1Path, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'fName': string, 'lName': string }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `login_1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login_1(      params:  { 'password': string, 'email': string }

): Observable<{ 'fName': string, 'lName': string }> {
    return this.login_1$Response( params).pipe(
      map((r: StrictHttpResponse<{ 'fName': string, 'lName': string }>) => r.body as { 'fName': string, 'lName': string })
    );
  }
   login_1FormGroup(value?:{ 'password': string, 'email': string }) {
    let schema: any = {"properties":{"password":{"type":"string","transform":["trim"],"minLength":6},"email":{"format":"email","type":"string","transform":["trim"]}},"type":"object","required":["password","email"]}
    if (schema["ref"]){
      schema = this.ajv.getSchema(schema.ref)
    }
    const validate = this.ajv.compile(schema);
    const formControls: any = {};
    const keys = Object.keys(schema.properties)
    for (const key of keys) {
    // @ts-ignore
    formControls[key] = new FormControl((value && value[key]) || '');
    }
    return this.fb.group<{ 'password': string, 'email': string }>( formControls as any,
      {
        validators: [
          (formGroup: FormGroupTypeSafe<{ 'password': string, 'email': string }>) => {
            const isValid = validate(formGroup.value);
            if (isValid) return null;
            const result: any = {};
            const errors = validate.errors;
            errors?.forEach(error => {
              const key =  error.dataPath.replace('/', '')
              result[key] = error.message;
              formControls[key].setErrors([error.message])
            });
            return result;
          }
        ]
      }
    );
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
  getUserAuthenticated$Response(
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.GetUserAuthenticatedPath, 'get');
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserAuthenticated$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserAuthenticated(
): Observable<void> {
    return this.getUserAuthenticated$Response( ).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation notEmptyString
   */
  static readonly NotEmptyStringPath = '/auth/not-empty-string';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `notEmptyString()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  notEmptyString$Response(      params:  { 'str'?: string }

): Observable<StrictHttpResponse<{ 'str'?: string }>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.NotEmptyStringPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'str'?: string }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `notEmptyString$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  notEmptyString(      params:  { 'str'?: string }

): Observable<{ 'str'?: string }> {
    return this.notEmptyString$Response( params).pipe(
      map((r: StrictHttpResponse<{ 'str'?: string }>) => r.body as { 'str'?: string })
    );
  }
   notEmptyStringFormGroup(value?:{ 'str'?: string }) {
    let schema: any = {"properties":{"str":{"type":"string","transform":["trim"]}},"type":"object"}
    if (schema["ref"]){
      schema = this.ajv.getSchema(schema.ref)
    }
    const validate = this.ajv.compile(schema);
    const formControls: any = {};
    const keys = Object.keys(schema.properties)
    for (const key of keys) {
    // @ts-ignore
    formControls[key] = new FormControl((value && value[key]) || '');
    }
    return this.fb.group<{ 'str'?: string }>( formControls as any,
      {
        validators: [
          (formGroup: FormGroupTypeSafe<{ 'str'?: string }>) => {
            const isValid = validate(formGroup.value);
            if (isValid) return null;
            const result: any = {};
            const errors = validate.errors;
            errors?.forEach(error => {
              const key =  error.dataPath.replace('/', '')
              result[key] = error.message;
              formControls[key].setErrors([error.message])
            });
            return result;
          }
        ]
      }
    );
  }

}
