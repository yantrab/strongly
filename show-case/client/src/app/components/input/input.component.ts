import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field/form-field';
import { FormControl } from '@angular/forms';
export type ValuesOf<T extends readonly any[]> = T[number];
// https://material.angular.io/components/input/overview
const materialInputTypes = [
  'color',
  'date',
  'datetime-local',
  'email',
  'month',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week'
] as const;
export declare type inputType = ValuesOf<typeof materialInputTypes> & 'textarea';

export declare type InputModel<T = any> = {
  key: keyof T & string;
  label?: string;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  hint?: string;
  type?: ValuesOf<typeof materialInputTypes>;
  options?: { value: any; title: string }[];
};

@Component({
  selector: 'app-input',
  templateUrl: `./input.component.html`,
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  @Input() model?: InputModel;
  @Input() control?: FormControl;
  get label() {
    return this.model?.label;
  }

  get hint() {
    return this.model?.hint;
  }

  get type() {
    return this.model?.type as string;
  }

  get appearance() {
    return this.model?.appearance;
  }
  hidePassword = true;
}
