import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Boxes,
    CircleAlert,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    Lock,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../auth.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./login.component.html",
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    icons = {
        logo: Boxes,
        mail: Mail,
        lock: Lock,
        key: KeyRound,
        eye: Eye,
        eyeOff: EyeOff,
        user: UserRound,
        shield: ShieldCheck,
        alert: CircleAlert,
        loader: LoaderCircle,
    };

    isSaving = false;
    showPassword = false;
    rememberMe = false;
    serverError = "";

    form = this.fb.nonNullable.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        rememberMe: [false],
    });

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!control && !!control.errors && (control.touched || control.dirty);
    }

    errorFor(controlName: string): string {
        const control = this.form.get(controlName);
        if (!control || !control.errors || (!control.touched && !control.dirty)) {
            return "";
        }
        const errors = control.errors;
        if (controlName === "email") {
            if (errors["required"]) return "Email is required";
            if (errors["email"]) return "Please enter a valid email address";
        }
        if (controlName === "password") {
            if (errors["required"]) return "Password is required";
            if (errors["minlength"]) return "Password must be at least 6 characters";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        // Prevent double submit
        if (this.isSaving) {
            return;
        }
        // Validate form
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.isSaving = true;
        this.serverError = '';
        const {
            email,
            password
        } = this.form.getRawValue();
        console.log('LOGIN REQUEST:', {
            email
        });
        this.authService
            .login(email, password)
            .subscribe({
                next: (response) => {
                    console.log(
                        'LOGIN SUCCESS:',
                        response
                    );
                    this.isSaving = false;
                    this.router.navigateByUrl(
                        '/dashboard'
                    );
                },
                error: (error) => {
                    console.error(
                        'LOGIN ERROR:',
                        error
                    );
                    this.isSaving = false;
                    this.serverError =
                        error?.error?.message ??
                        'Invalid email or password.';
                }
            });
    }

    private extractErrorMessage(error: unknown, fallback: string): string {
        const body = (error as { error?: { message?: unknown } })?.error;
        const msg = body?.message;
        if (Array.isArray(msg)) {
            return msg[0] || fallback;
        }
        if (typeof msg === "string" && msg.length > 0) {
            return msg;
        }
        return fallback;
    }
}
