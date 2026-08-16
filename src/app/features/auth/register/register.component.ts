import {
    Component,
    inject,
    OnDestroy,
} from '@angular/core';

import {
    CommonModule,
} from '@angular/common';

import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
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
    ImagePlus,
    KeyRound,
    Lock,
    User,
    UserPlus,
    ShieldCheck,
} from 'lucide-angular';

import {
    ButtonComponent,
} from '../../../shared/components/button/button.component';
import { AuthService } from '../auth.service';


@Component({
    selector: 'app-register',

    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        LucideAngularModule,
        ButtonComponent,
    ],

    templateUrl: './register.component.html',
})
export class RegisterComponent
    implements OnDestroy {


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

        key: KeyRound,

        user: User,

        userPlus: UserPlus,

        mail: AlertCircle,

        lock: Lock,

        eye: Eye,

        eyeOff: EyeOff,

        imagePlus: ImagePlus,

        alert: AlertCircle,

    };


    // ==========================
    // STATE
    // ==========================

    isSaving = false;

    showPassword = false;

    showConfirm = false;

    serverError = '';

    imageError = '';

    selectedFile: File | null = null;

    imagePreview: string | null = null;


    // ==========================
    // FORM
    // ==========================

    readonly form =
        this.fb.nonNullable.group(

            {

                username: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(30),
                    ],
                ],


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


                confirmPassword: [
                    '',
                    [
                        Validators.required,
                    ],
                ],

            },

            {
                validators:
                    this.passwordMatchValidator,
            }

        );


    // ==========================
    // PASSWORD MATCH
    // ==========================

    private passwordMatchValidator(
        control: AbstractControl
    ): ValidationErrors | null {

        const password =
            control.get('password')?.value;

        const confirmPassword =
            control.get('confirmPassword')?.value;


        if (
            password &&
            confirmPassword &&
            password !== confirmPassword
        ) {

            return {
                passwordMismatch: true,
            };

        }


        return null;

    }


    // ==========================
    // TOGGLE PASSWORD
    // ==========================

    togglePassword(): void {

        this.showPassword =
            !this.showPassword;

    }


    // ==========================
    // TOGGLE CONFIRM
    // ==========================

    toggleConfirm(): void {

        this.showConfirm =
            !this.showConfirm;

    }


    // ==========================
    // FILE SELECT
    // ==========================

    onFileSelected(
        event: Event
    ): void {

        this.imageError = '';


        const input =
            event.target as HTMLInputElement;


        const file =
            input.files?.[0];


        if (!file) {

            return;

        }


        // Maximum 5MB

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            this.imageError =
                'Image must be less than 5MB.';

            input.value = '';

            return;

        }


        // Check image

        if (
            !file.type.startsWith(
                'image/'
            )
        ) {

            this.imageError =
                'Please select an image file.';

            input.value = '';

            return;

        }


        this.selectedFile = file;


        // Preview

        this.imagePreview =
            URL.createObjectURL(file);

    }


    // ==========================
    // REMOVE IMAGE
    // ==========================

    removeImage(): void {

        if (this.imagePreview) {

            URL.revokeObjectURL(
                this.imagePreview
            );

        }


        this.selectedFile = null;

        this.imagePreview = null;

        this.imageError = '';

    }


    // ==========================
    // SUBMIT
    // ==========================

    onSubmit(): void {

        if (this.isSaving) {

            return;

        }


        if (
            this.form.invalid
        ) {

            this.form.markAllAsTouched();

            return;

        }


        if (this.imageError) {

            return;

        }


        this.isSaving = true;

        this.serverError = '';


        const {
            username,
            email,
            password,
        } =
            this.form.getRawValue();


        // ==========================
        // FORM DATA
        // ==========================

        const formData =
            new FormData();


        formData.append(
            'username',
            username.trim()
        );


        formData.append(
            'email',
            email.trim()
        );


        formData.append(
            'password',
            password
        );


        if (this.selectedFile) {

            formData.append(
                'image',
                this.selectedFile
            );

        }


        // ==========================
        // DEBUG: Angular sends file
        // ==========================

        console.log(
            '[A] Angular building FormData:',
            {
                username,
                email,
                file: this.selectedFile
                    ? {
                        name: this.selectedFile.name,
                        size: this.selectedFile.size,
                        type: this.selectedFile.type,
                    }
                    : null,
                keys: [...formData.keys()],
            }
        );


        // ==========================
        // API
        // ==========================

        this.authService
            .register(formData)
            .subscribe({

                next: (response) => {

                    console.log(
                        'REGISTER SUCCESS:',
                        response
                    );


                    this.isSaving = false;


                    // Clear form

                    this.form.reset();


                    this.removeImage();


                    // Go login

                    this.router.navigate([
                        '/login',
                    ]);

                },


                error: (error) => {

                    console.error(
                        'REGISTER ERROR:',
                        error
                    );


                    this.isSaving = false;


                    if (
                        error?.status === 0
                    ) {

                        this.serverError =
                            'Cannot connect to server. Please check your API URL.';

                        return;

                    }


                    this.serverError =
                        this.getServerError(error);

                },

            });

    }


    // ==========================
    // SERVER ERROR
    // ==========================

    private getServerError(
        error: any
    ): string {

        const message =
            error?.error?.message;


        if (
            Array.isArray(message)
        ) {

            return message.join(', ');

        }


        if (
            typeof message === 'string'
        ) {

            return message;

        }


        if (
            error?.status === 409
        ) {

            return 'Email or username already exists.';

        }


        if (
            error?.status === 400
        ) {

            return 'Invalid registration information.';

        }


        return 'Registration failed. Please try again.';

    }


    // ==========================
    // VALIDATION ERROR
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


        if (
            control.hasError('required')
        ) {

            return `${this.getLabel(controlName)
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

            if (
                controlName === 'username'
            ) {

                return 'Username must be at least 3 characters.';

            }


            return 'Password must be at least 6 characters.';

        }


        if (
            controlName === 'confirmPassword' &&
            this.form.hasError(
                'passwordMismatch'
            )
        ) {

            return 'Passwords do not match.';

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


        if (
            controlName === 'confirmPassword' &&
            this.form.hasError(
                'passwordMismatch'
            ) &&
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

            case 'username':
                return 'Username';

            case 'email':
                return 'Email';

            case 'password':
                return 'Password';

            case 'confirmPassword':
                return 'Confirm password';

            default:
                return 'Field';

        }

    }


    // ==========================
    // DESTROY
    // ==========================

    ngOnDestroy(): void {

        if (this.imagePreview) {

            URL.revokeObjectURL(
                this.imagePreview
            );

        }

    }

}