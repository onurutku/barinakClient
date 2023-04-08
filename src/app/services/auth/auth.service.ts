import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { HttpService } from '../base/http.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import Login from 'src/app/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;

  constructor(private baseHttpService: HttpService) {
    const userLoggedIn = JSON.parse(localStorage.getItem('user')!!);
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
}
