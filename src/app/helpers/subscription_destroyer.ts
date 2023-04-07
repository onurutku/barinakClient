import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class Destroyer implements OnDestroy {
  $destroyer: Subject<boolean> = new Subject<boolean>();
  constructor() {}
  ngOnDestroy(): void {
    this.$destroyer.next(true);
    this.$destroyer.unsubscribe();
  }
}
