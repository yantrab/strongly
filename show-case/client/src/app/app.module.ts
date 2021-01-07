import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiModule } from './api/api.module';
import { AuthComponent } from './pages/auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InputComponent } from './components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { FormComponent } from './components/form/form.component';
import { LetDirective } from './directives/let.directive';
import { RouterModule, Routes } from '@angular/router';
const isCordovaApp = Object(window).cordova !== undefined;

@Component({ selector: 'app-root', template: '<app-auth></app-auth><router-outlet></router-outlet>' })
class AppComponent {}

const routes: Routes = [];

@NgModule({
  declarations: [AppComponent, AuthComponent, InputComponent, FormComponent, LetDirective],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: isCordovaApp }),
    ApiModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
