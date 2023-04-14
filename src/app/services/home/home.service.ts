import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class HomeService extends Destroyer {
  $profileInfo: Subject<User> = new Subject<User>();
  userId: any = jwt_decode(
    JSON.parse(sessionStorage.getItem('user')!!).access_token
  );
  constructor(private readonly baseHttpService: HttpService) {
    super();
    this.getProfile(this.userId.sub);
  }
  getProfile(id: string) {
    this.baseHttpService
      .get<User>('auth/profile', { id: id })
      .pipe(takeUntil(this.$destroyer))
      .subscribe((user: User) => {
        const arr = [];
        arr.push(user);
        this.$profileInfo.next(user);
      });
  }
  public get profileInfo(): Observable<User> {
    return this.$profileInfo.asObservable();
  }
}
