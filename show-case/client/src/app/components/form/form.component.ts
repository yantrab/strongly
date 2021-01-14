import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputModel } from '../input/input.component';
import { FormGroupTypeSafe } from 'angular-typesafe-reactive-forms-helper';

export interface FormModel<T = any> {
  formGroup: T;
  fields: Array<InputModel>;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  formTitle?: string;
  formSaveButtonTitle?: string;
  formCancelButtonTitle?: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  constructor() {}
  @Input() model?: FormModel;
  @Output() emitter = new EventEmitter();
  ngOnInit(): void {
    console.log(this.model);
  }

  getControl(key: string) {
    return this.model?.formGroup.controls[key] as FormControl;
  }
}
