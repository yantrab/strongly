import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { FormModel, SwagularService } from 'swagular';

import { User, UserSchema } from '../models/user';

    export declare type LoginFormGroupType = { 'password': string, 'email': string }
    export const loginFormGroupSchema = {"properties":{"password":{"type":"string","minLength":6},"email":{"format":"email","type":"string"}},"type":"object","required":["password","email"]}

    export declare type SetPasswordFormGroupType = { 'rePassword': string, 'password': string, 'email': string }
    export const setPasswordFormGroupSchema = {"properties":{"rePassword":{"type":"string","minLength":6,"const":{"$data":"1/password"}},"password":{"type":"string","minLength":6},"email":{"format":"email","type":"string"}},"type":"object","required":["rePassword","password","email"]}

  
  


/**
 * User authentication stuff
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
    /**
     * Path part for operation login
     */
    static readonly LoginPath = '/auth/login';
    /**
     * Path part for operation setPassword
     */
    static readonly SetPasswordPath = '/auth/set-password';
    /**
     * Path part for operation logout
     */
    static readonly LogoutPath = '/auth/logout';
    /**
     * Path part for operation getUserAuthenticated
     */
    static readonly GetUserAuthenticatedPath = '/auth/get-user-authenticated';
  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
  }
  login(      params:  { 'password': string, 'email': string }

): Observable<User> {
    return this.login$Response( params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  setPassword(  params: {
      token: string;
      body: { 'rePassword': string, 'password': string, 'email': string }
    }

): Observable<void> {
    return this.setPassword$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  logout(
): Observable<void> {
    return this.logout$Response( ).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  getUserAuthenticated(
): Observable<User> {
    return this.getUserAuthenticated$Response( ).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

     loginFormGroup(value?:LoginFormGroupType) {
    return this.swagularService.getFormGroup<LoginFormGroupType>(loginFormGroupSchema, value);
  }

   loginFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof LoginFormGroupType & string)[] }, value?: LoginFormGroupType) {
    return this.swagularService.getFormModel<LoginFormGroupType>(loginFormGroupSchema, options, value);
  }

     setPasswordFormGroup(value?:SetPasswordFormGroupType) {
    return this.swagularService.getFormGroup<SetPasswordFormGroupType>(setPasswordFormGroupSchema, value);
  }

   setPasswordFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof SetPasswordFormGroupType & string)[] }, value?: SetPasswordFormGroupType) {
    return this.swagularService.getFormModel<SetPasswordFormGroupType>(setPasswordFormGroupSchema, options, value);
  }

  
  
private login$Response(      params:  { 'password': string, 'email': string }

): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.LoginPath, 'post');
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

private setPassword$Response(  params: {
      token: string;
      body: { 'rePassword': string, 'password': string, 'email': string }
    }

): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.SetPasswordPath, 'post');
      rb.header('token', params.token, {});
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

private logout$Response(
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.LogoutPath, 'post');
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

private getUserAuthenticated$Response(
): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, AuthService.GetUserAuthenticatedPath, 'get');
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
