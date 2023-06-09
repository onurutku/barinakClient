import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import BackendMessage from 'src/app/models/backendMessages.model';
import PasswordReset from 'src/app/models/passwordReset.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import passwordMatch from 'src/app/validators/password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ResetPasswordComponent extends Destroyer implements OnInit {
  passwordsForm!: FormGroup;
  backendMessage!: string;
  loading = false;
  userId!: string;
  errorMessage!: string;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.getIdFromURL();
    this.checkLoading();
    this.errorCatcher();
  }
  createForm() {
    this.passwordsForm = this.fb.group({
      password: [null, [Validators.required]],
      repassword: [null, [passwordMatch()]],
    });
  }
  getIdFromURL() {
    this.route.params.subscribe((params: Params) => {
      this.userId = params['id'];
    });
  }
  resetPassword() {
    const passwordResetInfo: PasswordReset = {
      userId: this.userId,
      newPassword: this.passwordsForm.get('password')?.value,
    };
    this.authService
      .resetPassword(passwordResetInfo)
      .pipe(takeUntil(this.$destroyer))
      .subscribe((response: BackendMessage) => {
        this.backendMessage = response.message;
        this.router.navigate(['/login']);
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
