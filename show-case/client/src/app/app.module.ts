import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { Guard } from './guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiModule } from './api/api.module';
import { InterceptorsService } from './services/interceptors.service';

const isCordovaApp = Object(window).cordova !== undefined;

@Component({ selector: 'app-root', template: '<router-outlet></router-outlet>' })
class AppComponent {}

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    canActivate: [Guard],
    loadChildren: () => import('src/app/main/main.module').then(m => m.MainModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: isCordovaApp }),
    HttpClientModule,
    ApiModule.forRoot({ rootUrl: 'http://localhost:3000' })
  ],

  providers: [
    Guard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
