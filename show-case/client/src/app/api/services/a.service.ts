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



  

@Injectable({
  providedIn: 'root',
})
export class AService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    private ajv: Ajv,
    private fb: FormBuilderTypeSafe
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getUsers
   */
  static readonly GetUsersPath = '/a/b';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers$Response(
): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, AService.GetUsersPath, 'get');
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers(
): Observable<string> {
    return this.getUsers$Response( ).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

}
