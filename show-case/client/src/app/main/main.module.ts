import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/comonent.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'p-root',
  template: 'main work<router-outlet></router-outlet>'
})
class MainComponent {}

@NgModule({
  declarations: [MainComponent],
  imports: [ComponentModule, RouterModule.forChild([])],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule {}
