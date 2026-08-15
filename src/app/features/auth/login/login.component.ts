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
    } =
      this.form.getRawValue();


    this.authService
      .login(
        email.trim(),
        password
      )
      .subscribe({

        next: (response) => {

          console.log(
            'LOGIN SUCCESS:',
            response
          );


          this.isSaving = false;


          // AuthService already saved
          // token + user


          this.router.navigate([
            '/dashboard',
          ]);

        },


        error: (error) => {

          console.error(
            'LOGIN ERROR:',
            error
          );


          this.isSaving = false;


          if (
            error?.status === 0
          ) {

            this.serverError =
              'Cannot connect to server. Please check the API URL or CORS.';

            return;

          }


          if (
            error?.status === 401
          ) {

            this.serverError =
              'Invalid email or password.';

            return;

          }


          if (
            error?.status >= 500
          ) {

            this.serverError =
              'Server error. Please try again.';

            return;

          }


          this.serverError =
            error?.error?.message ??
            'Invalid email or password.';

        },

      });

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