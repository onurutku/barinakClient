import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorSub: Subject<any> = new Subject<any>();
  constructor() {}
}
