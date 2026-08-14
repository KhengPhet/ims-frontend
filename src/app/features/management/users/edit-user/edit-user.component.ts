import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Building2,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    Mail,
    RefreshCw,
    Save,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { User, UserStatus } from "../../../../shared/models";
import { UsersService } from "../users.service";

@Component({
    selector: "app-edit-user",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-user.component.html",
})
export class EditUserComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(UsersService);

    record: User | null = null;

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        user: UserRound,
        mail: Mail,
        role: ShieldCheck,
        building: Building2,
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
        status: ["Active"],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/management/users"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            name: record.name,
            email: record.email,
            role: record.role,
            department: record.department,
            status: record.status,
        });
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
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            name: this.record.name,
            email: this.record.email,
            role: this.record.role,
            department: this.record.department,
            status: this.record.status,
        });
    }

    onSubmit(): void {
        if (this.form.invalid || !this.record) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;

        const v = this.form.getRawValue();
        this.service.update(this.record.id, {
            name: v.name,
            email: v.email,
            role: v.role,
            department: v.department,
            status: v.status as UserStatus,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/management/users"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/management/users"]);
    }
}
