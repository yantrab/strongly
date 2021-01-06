import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field/form-field';

@Component({
  selector: 'app-input',
  templateUrl: `./input.component.html`,
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.control?.statusChanges.subscribe(() => {});
  }
  @Input() control?: any;
  @Input() label = '';
  @Input() hint?: string;
  @Input() type = 'text';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() errorTranslations: any = {};
  @Input() isTextarea = false;
  hide = true;
}
