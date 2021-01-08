import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './api/services/auth.service';

@Injectable()
export class Guard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  async canActivate(route: ActivatedRouteSnapshot) {
    try {
      debugger;
      const user = await this.authService.getUserAuthenticated().toPromise();
      if (!route.data?.role) return true;
      return user.role === route.data.role;
    } catch {
      return this.router.navigate(['auth/login', {}]);
    }
  }
}
