import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    ComponentModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent
      }
    ])
  ]
})
export class AdminModule {}
