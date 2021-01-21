import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from './api-configuration';
import { FormControl } from '@angular/forms';
import { FormBuilderTypeSafe, FormGroupTypeSafe } from 'angular-typesafe-reactive-forms-helper';
import Ajv from 'ajv';
import { FormModel } from '../components/form/form.component';
import * as _ from 'lodash';

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

  ajvFormatToHtml: any = { time: 'time', date: 'date', dateTime: 'datetime-local', email: 'email', uri: 'url' };
  getPropertyType(prop: any) {
    if (prop.enum) return 'select';
    if (prop.type === 'array') return 'multi-select';
    return this.ajvFormatToHtml[prop.format] || prop.type;
  }

  getFormModel<T>(schema: any, options?: Partial<FormModel<T>> & { displayProperties?: (keyof T & string)[] }, value?: T) {
    const optionFields = _.keyBy(options?.fields, 'key');
    const properties: any[] = Object.keys(schema.properties).map(key => ({ key, ...schema.properties[key] }));
    const userFormModel: FormModel<T> = {
      formGroup: options?.formGroup || this.getFormGroup(schema, value),
      formSaveButtonTitle: options?.formSaveButtonTitle || 'Save',
      formCancelButtonTitle: options?.formCancelButtonTitle || 'Cancel',
      formTitle: options?.formTitle,
      appearance: options?.appearance,
      fields: _(properties)
        .filter(p => !p.key.startsWith('_') && (!options?.displayProperties || options.displayProperties.includes(p.key)))
        .orderBy(p => options?.displayProperties?.findIndex(prop => prop === p.key))
        .map(
          p =>
            optionFields[p.key] || {
              key: p.key,
              label: p.key.charAt(0).toUpperCase() + p.key.slice(1).replace(/([A-Z])/g, ($1: string) => ' ' + $1),
              type: this.getPropertyType(p),
              options: p.enum?.map((key: any) => ({ title: key, value: key })) // TODO array
            }
        )
        .value()
    };
    return userFormModel;
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
