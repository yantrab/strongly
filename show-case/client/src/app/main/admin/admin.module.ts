import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ComponentModule } from '../../components/comonent.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    ComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent
      }
    ])
  ]
})
export class AdminModule {}
