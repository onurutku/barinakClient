import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Destroyer } from 'src/app/helpers/subscription_destroyer';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import passwordMatch from './../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent extends Destroyer implements OnInit {
  registerForm!: FormGroup;
  errorMessage!: string;
  verificationMessage!: string;
  loading = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.errorCatcher();
    this.checkLoading();
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(50)]],
      surname: [null, [Validators.required, Validators.maxLength(50)]],
      age: [null, [Validators.required, Validators.max(130)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null],
      repassword: [null, [passwordMatch()]],
    });
  }
  signUp() {
    const register = {
      name: this.registerForm.get('name')?.value,
      surname: this.registerForm.get('surname')?.value,
      age: this.registerForm.get('age')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };
    this.authService
      .register(register)
      .pipe(takeUntil(this.$destroyer))
      .subscribe((registerResponse: User) => {
        if (registerResponse) {
          this.sendEmailVerificationMail(register);
        }
      });
  }
  sendEmailVerificationMail(registerInfo: any) {
    return this.authService
      .sendEmailVerification(registerInfo.email)
      .pipe(takeUntil(this.$destroyer))
      .subscribe(() => {
        this.verificationMessage =
          'A verification mail has been sent, please check your mailbox';
      });
  }
  errorCatcher() {
    this.loadingService.errorSub
      .pipe(takeUntil(this.$destroyer))
      .subscribe((error: { statusCode: number; message: string }) => {
        this.errorMessage = error.message;
      });
  }
  checkLoading(): void {
    this.loadingService.loadingSub
      .pipe(takeUntil(this.$destroyer))
      .subscribe((isLoading: boolean) => {
        this.loading = isLoading;
      });
  }
}
