import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from './input/input.component';
import { FormComponent } from './form/form.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MatSortModule } from '@angular/material/sort';
import { CellDefDirective } from './table/cell-def.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
const materialModules = [
  FlexLayoutModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  ScrollingModule,
  TableVirtualScrollModule,
  MatTableModule,
  MatSnackBarModule
];
@NgModule({
  declarations: [InputComponent, FormComponent, TableComponent, CellDefDirective],
  imports: [CommonModule, ReactiveFormsModule, ...materialModules, MatSortModule, MatDialogModule, MatSelectModule, FormsModule],
  exports: [FormComponent, TableComponent, CommonModule, ...materialModules],
  providers: []
})
export class ComponentModule {}
