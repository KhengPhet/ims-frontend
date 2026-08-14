import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Boxes,
    CircleAlert,
    Eye,
    EyeOff,
    ImagePlus,
    KeyRound,
    LoaderCircle,
    Lock,
    Mail,
    ShieldCheck,
    UserPlus,
    UserRound,
} from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../auth.service";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./register.component.html",
})
export class RegisterComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    icons = {
        logo: Boxes,
        userPlus: UserPlus,
        user: UserRound,
        mail: Mail,
        lock: Lock,
        key: KeyRound,
        shield: ShieldCheck,
        eye: Eye,
        eyeOff: EyeOff,
        alert: CircleAlert,
        loader: LoaderCircle,
        imagePlus: ImagePlus,
    };

    isSaving = false;
    showPassword = false;
    showConfirm = false;
    serverError = "";

    selectedFile: File | null = null;
    imagePreview: string | null = null;
    imageError = "";

    form = this.fb.nonNullable.group(
        {
            username: ["", [Validators.required, Validators.minLength(2)]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            confirmPassword: ["", [Validators.required]],
        },
        { validators: this.matchPasswords },
    );

    get passwordMatchError(): boolean {
        return (
            !!this.form.controls.confirmPassword.value &&
            !!this.form.controls.password.value &&
            this.form.controls.password.value !== this.form.controls.confirmPassword.value
        );
    }

    private matchPasswords(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password")?.value;
        const confirmPassword = control.get("confirmPassword")?.value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return (
            (!!control && !!control.errors && (control.touched || control.dirty)) ||
            (controlName === "confirmPassword" && this.passwordMatchError && (control?.touched ?? false))
        );
    }

    errorFor(controlName: string): string {
        const control = this.form.get(controlName);
        const show = control?.touched || control?.dirty;
        if (!control || !show) {
            return "";
        }
        const errors = control.errors;
        if (controlName === "username") {
            if (errors?.["required"]) return "Username is required";
            if (errors?.["minlength"]) return "Username must be at least 2 characters";
        }
        if (controlName === "email") {
            if (errors?.["required"]) return "Email is required";
            if (errors?.["email"]) return "Please enter a valid email address";
        }
        if (controlName === "password") {
            if (errors?.["required"]) return "Password is required";
            if (errors?.["minlength"]) return "Password must be at least 6 characters";
        }
        if (controlName === "confirmPassword") {
            if (errors?.["required"]) return "Please confirm your password";
            if (this.passwordMatchError) return "Passwords do not match";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirm(): void {
        this.showConfirm = !this.showConfirm;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        this.imageError = "";
        this.imagePreview = null;
        this.selectedFile = null;
        if (!file) {
            return;
        }
        if (!file.type.startsWith("image/")) {
            this.imageError = "Please select an image file";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.imageError = "Image size must be less than 5MB";
            return;
        }
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
    removeImage(): void {
        this.selectedFile = null;
        this.imagePreview = null;
        this.imageError = "";
    }

    onSubmit(): void {
        if (this.form.invalid || this.passwordMatchError) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        this.serverError = "";

        const v = this.form.getRawValue();

        const formData = new FormData();
        formData.append("username", v.username);
        formData.append("email", v.email);
        formData.append("password", v.password);
        if (this.selectedFile) {
            formData.append("image", this.selectedFile, this.selectedFile.name);
        }

        this.authService.register(formData).subscribe({
            next: () => {
                this.isSaving = false;
                this.router.navigate(["/login"]);
            },
            error: (error) => {
                this.isSaving = false;
                this.serverError = this.extractErrorMessage(error, "Registration failed. Please try again.");
            },
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
