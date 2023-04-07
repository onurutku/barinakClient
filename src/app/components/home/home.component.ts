import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  user!: User;
  constructor() {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }
}
