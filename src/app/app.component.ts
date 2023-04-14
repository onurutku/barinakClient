import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'barinakClient';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user')!!);
    this.authService.userSubject.next(user);
  }
}
