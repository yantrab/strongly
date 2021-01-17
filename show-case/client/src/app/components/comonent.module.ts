import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from './input/input.component';
import { FormComponent } from './form/form.component';
import { CommonModule } from '@angular/common';
const materialModules = [
  FlexLayoutModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule
];
@NgModule({
  declarations: [InputComponent, FormComponent],
  imports: [CommonModule, ReactiveFormsModule, ...materialModules],
  exports: [FormComponent, CommonModule, ...materialModules],
  providers: []
})
export class ComponentModule {}
