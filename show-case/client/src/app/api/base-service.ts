import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from './api-configuration';
import { FormControl } from '@angular/forms';
import { FormBuilderTypeSafe, FormGroupTypeSafe } from 'angular-typesafe-reactive-forms-helper';
import Ajv from 'ajv';

/**
 * Base class for services
 */
@Injectable()
export class BaseService {
  private _rootUrl = '';

  constructor(protected config: ApiConfiguration, protected http: HttpClient, private ajv: Ajv, private fb: FormBuilderTypeSafe) {}

  /**
   * Returns the root url for all operations in this service. If not set directly in this
   * service, will fallback to `ApiConfiguration.rootUrl`.
   */
  get rootUrl(): string {
    return this._rootUrl || this.config.rootUrl;
  }

  /**
   * Sets the root URL for API operations in this service.
   */
  set rootUrl(rootUrl: string) {
    this._rootUrl = rootUrl;
  }

  getFormGroup<T>(schema: any, value?: T) {
    if (schema.$ref) {
      schema = this.ajv.getSchema(schema.ref);
    }
    const validate = this.ajv.compile(schema);
    const formControls: any = {};
    const keys = Object.keys(schema.properties);
    for (const key of keys) {
      formControls[key] = new FormControl(value && (value as any)[key]);
    }
    return this.fb.group<T>(formControls as any, {
      validators: [
        (formGroup: FormGroupTypeSafe<T>) => {
          Object.keys(formGroup.value).forEach(key => {
            // @ts-ignore
            value = formGroup.value[key];
            if (typeof value === 'string') {
              // @ts-ignore
              value = value.trim();
            }
            if (!value) value = undefined;
            // @ts-ignore
            formGroup.value[key] = value;
          });
          const isValid = validate(formGroup.value);
          if (isValid) return null;
          const result: any = {};
          const errors = validate.errors;
          errors?.forEach((error: any) => {
            const key = error.dataPath.replace('/', '') || error.params.missingProperty;
            result[key] = error.message;
            formControls[key].setErrors([error.message]);
          });
          return result;
        }
      ]
    });
  }
}
