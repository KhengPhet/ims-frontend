import {
  Component,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';

import {
  LucideAngularModule,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-angular';


import {
  ButtonComponent,
} from '../../../shared/components/button/button.component';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule,
    ButtonComponent,
  ],

  templateUrl: './login.component.html',
})
export class LoginComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  // ==========================
  // ICONS
  // ==========================

  readonly icons = {

    logo: KeyRound,

    shield: ShieldCheck,

    user: User,

    key: KeyRound,

    mail: Mail,

    lock: Lock,

    eye: Eye,

    eyeOff: EyeOff,

    alert: AlertCircle,

    loader: LoaderCircle,

  };


  // ==========================
  // STATE
  // ==========================

  isSaving = false;

  showPassword = false;

  serverError = '';


  // ==========================
  // FORM
  // ==========================

  readonly form =
    this.fb.nonNullable.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],

      rememberMe: [
        false,
      ],

    });


  // ==========================
  // TOGGLE PASSWORD
  // ==========================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // ==========================
  // SUBMIT
  // ==========================

  onSubmit(): void {

    if (this.isSaving) {

      return;

    }


    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    this.isSaving = true;

    this.serverError = '';


    const {
      email,
      password,
      rememberMe,
    } =
      this.form.getRawValue();


    this.authService
      .login(
        email.trim(),
        password,
        rememberMe
      )
      .subscribe({

        next: () => {

          this.isSaving = false;


          // AuthService already saved
          // token + user


          this.router.navigateByUrl(
            this.resolveReturnUrl()
          );

        },


        error: (error) => {

          console.error(
            'LOGIN ERROR:',
            error
          );


          this.isSaving = false;


          this.serverError =
            this.getServerError(error);

        },

      });

  }


  // ==========================
  // RETURN URL
  // ==========================

  private resolveReturnUrl(): string {

    const returnUrl =
      this.route.snapshot
        .queryParamMap
        .get('returnUrl');


    if (
      returnUrl &&
      returnUrl.startsWith('/') &&
      !returnUrl.startsWith('//')
    ) {

      return returnUrl;

    }


    return '/dashboard';

  }


  // ==========================
  // SERVER ERROR
  // ==========================

  private getServerError(
    error: any
  ): string {

    if (
      error?.status === 0
    ) {

      return 'Cannot connect to server. Please check the API URL or CORS.';

    }


    const message =
      error?.error?.message;


    if (
      Array.isArray(message)
    ) {

      return message.join(', ');

    }


    if (
      typeof message === 'string' &&
      message.trim()
    ) {

      return message;

    }


    if (
      error?.status === 401
    ) {

      return 'Invalid email or password.';

    }


    if (
      error?.status === 400
    ) {

      return 'Invalid request. Please check your input.';

    }


    if (
      error?.status >= 500
    ) {

      return 'Server error. Please try again.';

    }


    return 'Something went wrong. Please try again.';

  }


  // ==========================
  // VALIDATION MESSAGE
  // ==========================

  errorFor(
    controlName: string
  ): string {

    const control =
      this.form.get(controlName);


    if (
      !control ||
      !control.touched
    ) {

      return '';

    }


    if (control.hasError('required')) {

      return `${
        this.getLabel(controlName)
      } is required.`;

    }


    if (
      control.hasError('email')
    ) {

      return 'Please enter a valid email.';

    }


    if (
      control.hasError('minlength')
    ) {

      return 'Password must be at least 6 characters.';

    }


    return '';

  }


  // ==========================
  // INPUT CLASS
  // ==========================

  inputClass(
    controlName: string
  ): string {

    const control =
      this.form.get(controlName);


    if (
      control?.invalid &&
      control?.touched
    ) {

      return 'border-red-300 focus:ring-red-500';

    }


    return 'border-gray-200';

  }


  // ==========================
  // LABEL
  // ==========================

  private getLabel(
    controlName: string
  ): string {

    switch (controlName) {

      case 'email':
        return 'Email';

      case 'password':
        return 'Password';

      default:
        return 'Field';

    }

  }

}