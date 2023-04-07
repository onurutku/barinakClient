import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs';
import Login from 'src/app/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private baseHttpService: HttpService) {}
  login(user: Login, params?: unknown): Observable<User> {
    return this.baseHttpService.post<User>('auth/login', user, params);
  }
  register(userRegister: User, params?: unknown): Observable<User> {
    return this.baseHttpService.post<User>(
      'auth/register',
      userRegister,
      params
    );
  }
}
