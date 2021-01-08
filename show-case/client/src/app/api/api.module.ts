/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';
import { FormBuilderTypeSafe } from 'angular-typesafe-reactive-forms-helper';

import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import Ajv from "ajv";
import addFormats from 'ajv-formats';
import ajvKeywords from 'ajv-keywords';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvKeywords(ajv)
/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [HttpClientModule],
  exports: [],
  declarations: [],
  providers: [FormBuilderTypeSafe,
{provide:Ajv, useValue: ajv},
    AdminService,
    AuthService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor(
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}