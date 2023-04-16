import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class ForgotPasswordComponent extends Destroyer implements OnInit {
  forgotPassEmail!: FormGroup;
  errorMessage!: string;
  passwordResetMessage!: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private readonly loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.forgotPassEmail = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }
  sendPasswordResetMail() {
    this.authService
      .sendPasswordResetMail(this.forgotPassEmail.value)
      .pipe(takeUntil(this.$destroyer))
      .subscribe((response: string) => {
        this.passwordResetMessage = response;
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
