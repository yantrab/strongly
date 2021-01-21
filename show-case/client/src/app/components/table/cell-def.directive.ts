import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCellDef]'
})
export class CellDefDirective {
  @Input('column') private key = '';

  constructor(public template: TemplateRef<any>) {}
}
