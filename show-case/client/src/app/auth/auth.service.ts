import { Injectable } from '@angular/core';
import { AuthService as Api } from '../api/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../api/models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$: BehaviorSubject<User | any> = new BehaviorSubject(null);
  public readonly user$: Observable<User> = this._user$.asObservable();

  constructor(private api: Api) {}

  getUserAuthenticated() {
    return this.api.getUserAuthenticated().pipe(
      map((user: User) => {
        this._user$.next(user);
        return user;
      })
    );
  }

  logout() {
    return this.api.logout();
  }
}
