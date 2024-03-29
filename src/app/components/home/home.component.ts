import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import { User } from 'src/app/models/user.model';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent extends Destroyer implements OnInit {
  $user!: Observable<User | null>;
  constructor(private readonly homeService: HomeService) {
    super();
    this.$user = this.homeService.profileInfo;
  }
  ngOnInit(): void {}
  onChange(e: any) {
    const formData = new FormData();
    formData.append('file', e.target.files[0], e.target.files[0].name);
    this.homeService.sendFile(formData);
  }
}
