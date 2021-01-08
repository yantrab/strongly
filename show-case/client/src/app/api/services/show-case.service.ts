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

import { UserDetails, UserDetailsSchema } from '../models/user-details';

  
  
  export declare type loginFormGroupType = FormGroupTypeSafe<{ 'password': string, 'email': string }>

  export declare type saveUserFormGroupType = FormGroupTypeSafe<UserDetails>

  export declare type saveContactFormGroupType = FormGroupTypeSafe<{ 'address'?: string, 'id': number }>


@Injectable({
  providedIn: 'root',
})
export class ShowCaseService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    private ajv: Ajv,
    private fb: FormBuilderTypeSafe
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getUser
   */
  static readonly GetUserPath = '/show-case/getUser/:id';

  /**
   * id is required in the param and should by number
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Response(  params: {
      id: string;
    }

): Observable<StrictHttpResponse<{ 'name': string }>> {

    const rb = new RequestBuilder(this.rootUrl, ShowCaseService.GetUserPath, 'get');
      rb.path('id', params.id, {});
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'name': string }>;
      })
    );
  }

  /**
   * id is required in the param and should by number
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser(  params: {
      id: string;
    }

): Observable<{ 'name': string }> {
    return this.getUser$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'name': string }>) => r.body as { 'name': string })
    );
  }

  /**
   * Path part for operation getUsers2
   */
  static readonly GetUsers2Path = '/show-case/getUsers2/:id';

  /**
   * this is the same as previous one, with convenient way
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsers2()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers2$Response(  params: {
      id: string;
    }

): Observable<StrictHttpResponse<{ 'name': string }>> {

    const rb = new RequestBuilder(this.rootUrl, ShowCaseService.GetUsers2Path, 'get');
      rb.path('id', params.id, {});
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'name': string }>;
      })
    );
  }

  /**
   * this is the same as previous one, with convenient way
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUsers2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers2(  params: {
      id: string;
    }

): Observable<{ 'name': string }> {
    return this.getUsers2$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'name': string }>) => r.body as { 'name': string })
    );
  }

  /**
   * Path part for operation login
   */
  static readonly LoginPath = '/show-case/login';

  /**
   * you can add validation as you want
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login$Response(      params:  { 'password': string, 'email': string }

): Observable<StrictHttpResponse<{ 'name': string }>> {

    const rb = new RequestBuilder(this.rootUrl, ShowCaseService.LoginPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'name': string }>;
      })
    );
  }

  /**
   * you can add validation as you want
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(      params:  { 'password': string, 'email': string }

): Observable<{ 'name': string }> {
    return this.login$Response( params).pipe(
      map((r: StrictHttpResponse<{ 'name': string }>) => r.body as { 'name': string })
    );
  }
   loginFormGroup(value?:{ 'password': string, 'email': string }) {
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
   * Path part for operation saveUser
   */
  static readonly SaveUserPath = '/show-case/save-user';

  /**
   * you can add validation on the class,  name should be ta least 10 letters
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveUser$Response(      params:  UserDetails

): Observable<StrictHttpResponse<UserDetails>> {

    const rb = new RequestBuilder(this.rootUrl, ShowCaseService.SaveUserPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserDetails>;
      })
    );
  }

  /**
   * you can add validation on the class,  name should be ta least 10 letters
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `saveUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveUser(      params:  UserDetails

): Observable<UserDetails> {
    return this.saveUser$Response( params).pipe(
      map((r: StrictHttpResponse<UserDetails>) => r.body as UserDetails)
    );
  }
   saveUserFormGroup(value?:UserDetails) {
    let schema: any = {"$ref":"#/components/schemas/UserDetails"}
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
    return this.fb.group<UserDetails>( formControls as any,
      {
        validators: [
          (formGroup: FormGroupTypeSafe<UserDetails>) => {
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
   * Path part for operation saveContact
   */
  static readonly SaveContactPath = '/show-case/save-contact';

  /**
   * or send your schema validation
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveContact()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveContact$Response(      params:  { 'address'?: string, 'id': number }

): Observable<StrictHttpResponse<{ 'address'?: string, 'id': number }>> {

    const rb = new RequestBuilder(this.rootUrl, ShowCaseService.SaveContactPath, 'post');
      rb.body(params, 'application/json');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'address'?: string, 'id': number }>;
      })
    );
  }

  /**
   * or send your schema validation
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `saveContact$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveContact(      params:  { 'address'?: string, 'id': number }

): Observable<{ 'address'?: string, 'id': number }> {
    return this.saveContact$Response( params).pipe(
      map((r: StrictHttpResponse<{ 'address'?: string, 'id': number }>) => r.body as { 'address'?: string, 'id': number })
    );
  }
   saveContactFormGroup(value?:{ 'address'?: string, 'id': number }) {
    let schema: any = {"type":"object","properties":{"address":{"type":"string","transform":["trim"],"maxLength":10},"id":{"type":"number"}},"required":["id"]}
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
    return this.fb.group<{ 'address'?: string, 'id': number }>( formControls as any,
      {
        validators: [
          (formGroup: FormGroupTypeSafe<{ 'address'?: string, 'id': number }>) => {
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
