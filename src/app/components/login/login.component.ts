import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent extends Destroyer implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.checkLoading();
    this.errorCatcher();
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
  login(): void {
    this.authService
      .login(this.loginForm.value)
      .pipe(takeUntil(this.$destroyer))
      .subscribe((userLoggedIn: User) => {
        sessionStorage.setItem('user', JSON.stringify(userLoggedIn));
        console.log(userLoggedIn);

        this.router.navigate(['']);
      });
  }
  checkLoading(): void {
    this.loadingService.loadingSub
      .pipe(takeUntil(this.$destroyer))
      .subscribe((isLoading: boolean) => {
        this.loading = isLoading;
      });
  }
  errorCatcher() {
    this.loadingService.errorSub
      .pipe(takeUntil(this.$destroyer))
      .subscribe((error: { statusCode: number; message: string }) => {
        this.errorMessage = error.message;
      });
  }
}
