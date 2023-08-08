import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import jwt_decode from 'jwt-decode';
import { DomSanitizer, SafeUrl, SafeValue } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class HomeService extends Destroyer {
  $profileInfo: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  userId: any = jwt_decode(
    JSON.parse(sessionStorage.getItem('user')!!).access_token
  );
  constructor(
    private readonly baseHttpService: HttpService,
    private _sanitizer: DomSanitizer
  ) {
    super();
    this.getProfile(this.userId.sub);
  }
  getProfile(id: string) {
    this.baseHttpService
      .get<User>('auth/profile', { id: id })
      .pipe(takeUntil(this.$destroyer))
      .subscribe((user: User) => {
        const profilePicture: any = this._sanitizer.bypassSecurityTrustUrl(
          user.profilePicture!
        );
        user.profilePicture =
          profilePicture.changingThisBreaksApplicationSecurity;
        this.$profileInfo.next(user);
      });
  }
  public get profileInfo(): Observable<User | null> {
    return this.$profileInfo.asObservable();
  }
  sendFile(file: any) {
    this.baseHttpService
      .post('home/file', file, { id: this.$profileInfo.getValue()?.id })
      .pipe(takeUntil(this.$destroyer))
      .subscribe((user: any) => {
        const profilePicture: any = this._sanitizer.bypassSecurityTrustUrl(
          user.profilePicture!
        );
        user.profilePicture =
          profilePicture.changingThisBreaksApplicationSecurity;
        this.$profileInfo.next(user);
      });
  }
}
