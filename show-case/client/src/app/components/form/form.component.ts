import { Component, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputModel } from '../input/input.component';
import { FormGroupTypeSafe } from 'angular-typesafe-reactive-forms-helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FormModel<T = any> {
  formGroup: FormGroupTypeSafe<T>;
  fields: Array<InputModel<T>>;
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
export class FormComponent {
  @Input() model?: FormModel;
  @Output() emitter = new EventEmitter();
  constructor(
    @Optional() public dialogRef: MatDialogRef<FormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: FormModel<any>
  ) {
    if (data) {
      this.model = data;
    }
  }

  getControl(key: string) {
    return this.model?.formGroup.controls[key] as FormControl;
  }
  save() {
    if (this.dialogRef) {
      if (this.model?.formGroup.valid) this.dialogRef.close(this.model?.formGroup.value);
    } else {
      this.emitter.emit(this.model?.formGroup.value);
    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
