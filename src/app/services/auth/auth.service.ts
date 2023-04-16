import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { HttpService } from '../base/http.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import Login from 'src/app/models/login.model';
import PasswordReset from 'src/app/models/passwordReset.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubject: BehaviorSubject<User>;

  constructor(private baseHttpService: HttpService) {
    const userLoggedIn = JSON.parse(sessionStorage.getItem('user')!!);
    this.userSubject = new BehaviorSubject<User>(userLoggedIn);
  }
  login(user: Login, params?: unknown): Observable<User> {
    return this.baseHttpService.post<User>('auth/login', user, params).pipe(
      map((user: User) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }
  register(userRegister: User, params?: unknown): Observable<User> {
    return this.baseHttpService.post<User>(
      'auth/register',
      userRegister,
      params
    );
  }
  sendEmailVerification(email: string) {
    return this.baseHttpService.get('email/verification', { mailTo: email });
  }
  public get userValue(): User | null {
    return this.userSubject.value;
  }
  getRefreshToken() {
    return this.baseHttpService.post('auth/refresh', {});
  }
  sendPasswordResetMail(email: string) {
    return this.baseHttpService.post<string>(
      'auth/password-reset-email',
      email
    );
  }
  resetPassword(passwordResetInfo: PasswordReset) {
    return this.baseHttpService.post<string>(
      'auth/reset-password',
      passwordResetInfo
    );
  }
}
