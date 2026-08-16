import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    BadgeCheck,
    Building2,
    ChevronRight,
    CircleAlert,
    KeyRound,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
} from "lucide-angular";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { MyProfile, ProfileService } from "./profile.service";
import { resolveImageUrl } from "../../core/utils/image-url.util";

@Component({
    selector: "app-my-profile",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./my-profile.component.html",
})
export class MyProfileComponent {
    private readonly fb = inject(FormBuilder);
    private readonly service = inject(ProfileService);

    icons = {
        save: Save,
        chevronRight: ChevronRight,
        user: UserRound,
        mail: Mail,
        phone: Phone,
        building: Building2,
        mapPin: MapPin,
        check: BadgeCheck,
        shield: ShieldCheck,
        key: KeyRound,
        lock: Lock,
        alert: CircleAlert,
    };

    isSaving = false;
    saved = false;

    form = this.fb.nonNullable.group({
        fullName: ["", [Validators.required, Validators.minLength(2)]],
        username: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: [""],
        department: [""],
        location: [""],
        bio: [""],
        image: [""],
    });

    constructor() {
        const profile = this.service.profile();
        this.form.patchValue({
            fullName: profile.fullName,
            username: profile.username,
            email: profile.email,
            phone: profile.phone,
            department: profile.department,
            location: profile.location,
            bio: profile.bio,
            image: profile.image ?? "",
        });
    }

    get current(): MyProfile {
        return this.service.profile();
    }

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    imageSrc(value: string | null | undefined): string {
        return resolveImageUrl(value);
    }

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
        if (controlName === "fullName") {
            if (errors["required"]) return "Full name is required";
            if (errors["minlength"]) return "Name must be at least 2 characters";
        }
        if (controlName === "username") return "Username is required";
        if (controlName === "email") {
            if (errors["required"]) return "Email is required";
            if (errors["email"]) return "Please enter a valid email address";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    joinedDate(): string {
        return "January 12, 2026";
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        this.saved = false;

        const v = this.form.getRawValue();
        this.service.save({
            fullName: v.fullName,
            username: v.username,
            email: v.email,
            phone: v.phone,
            department: v.department,
            location: v.location,
            bio: v.bio,
            image: v.image || null,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.saved = true;
            setTimeout(() => (this.saved = false), 2500);
        }, 1000);
    }

    resetForm(): void {
        const profile = this.service.profile();
        this.form.patchValue({
            fullName: profile.fullName,
            username: profile.username,
            email: profile.email,
            phone: profile.phone,
            department: profile.department,
            location: profile.location,
            bio: profile.bio,
            image: profile.image ?? "",
        });
        this.saved = false;
    }
}
