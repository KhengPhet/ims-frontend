import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Building2,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    LoaderCircle,
    Mail,
    Phone,
    RefreshCw,
    Save,
    Send,
    ShieldCheck,
    UserPlus,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { ToggleComponent } from "../../../../shared/components/toggle/toggle.component";
import { User, UserStatus } from "../../../../shared/models";
import { UsersService } from "../users.service";

@Component({
    selector: "app-add-user",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent, ToggleComponent],
    templateUrl: "./add-user.component.html",
})
export class AddUserComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly service = inject(UsersService);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        userPlus: UserPlus,
        user: UserRound,
        mail: Mail,
        phone: Phone,
        building: Building2,
        shield: ShieldCheck,
        send: Send,
        alert: CircleAlert,
    };

    roles = ["Administrator", "Inventory Manager", "Sales Manager", "Purchasing", "Accountant", "Viewer"];
    departments = ["Operations", "Warehouse", "Sales", "Procurement", "Finance", "Marketing"];
    statuses: UserStatus[] = ["Active", "Pending", "Inactive"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        role: ["Viewer", Validators.required],
        department: ["", Validators.required],
        phone: [""],
        status: ["Active"],
        sendInvite: [true],
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
        if (controlName === "name") {
            if (errors["required"]) return "Full name is required";
            if (errors["minlength"]) return "Name must be at least 2 characters";
        }
        if (controlName === "email") {
            if (errors["required"]) return "Email is required";
            if (errors["email"]) return "Please enter a valid email address";
        }
        if (controlName === "role") return "Please select a role";
        if (controlName === "department") return "Please select a department";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    resetForm(): void {
        this.form.reset({
            name: "",
            email: "",
            role: "Viewer",
            department: "",
            phone: "",
            status: "Active",
            sendInvite: true,
        });
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

        const v = this.form.getRawValue();
        const record: Omit<User, "id"> = {
            name: v.name,
            email: v.email,
            role: v.role,
            department: v.department,
            status: v.status as UserStatus,
        };

        this.service.create(record);

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/management/users"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/management/users"]);
    }
}
