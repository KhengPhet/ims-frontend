import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Check,
    ChevronRight,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Save,
    ShieldCheck,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { RoleEntry } from "../../../../shared/models";

interface PermissionGroup {
    label: string;
    permissions: string[];
}

@Component({
    selector: "app-add-role",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./add-role.component.html",
})
export class AddRoleComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        shield: ShieldCheck,
        check: Check,
        alert: CircleAlert,
    };

    permissionGroups: PermissionGroup[] = [
        { label: "Administration", permissions: ["Manage users & roles", "Manage settings", "Full module access", "Delete records"] },
        { label: "Inventory", permissions: ["View & edit products", "Stock in / stock out", "Inventory adjustments", "View stock levels"] },
        { label: "Sales", permissions: ["View & manage orders", "Manage customers", "Process payments", "Issue invoices"] },
        { label: "Purchasing", permissions: ["Create & edit POs", "Manage suppliers", "Approve purchase orders"] },
        { label: "Finance", permissions: ["View financial data", "Generate reports", "Export data", "Reconcile payments"] },
        { label: "General", permissions: ["View dashboards", "View reports"] },
    ];

    isSaving = false;

    permissions = this.fb.array<FormControl<boolean>>(this.permissionGroups.flatMap((group) => group.permissions.map(() => this.fb.nonNullable.control<boolean>(false))));

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        description: ["", Validators.required],
        permissions: this.permissions,
    });

    get permissionControls(): FormControl<boolean>[] {
        return this.permissions.controls;
    }

    get allPermissionNames(): string[] {
        return this.permissionGroups.flatMap((group) => group.permissions);
    }

    get selectedCount(): number {
        return this.permissions.controls.filter((control) => control.value).length;
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
            if (errors["required"]) return "Role name is required";
            if (errors["minlength"]) return "Name must be at least 2 characters";
        }
        if (controlName === "description") return "Description is required";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    permissionIndex(groupIndex: number, permissionIndex: number): number {
        return this.permissionGroups.slice(0, groupIndex).reduce((sum, group) => sum + group.permissions.length, 0) + permissionIndex;
    }

    selectAll(): void {
        this.permissionControls.forEach((control) => control.setValue(true));
    }

    clearAll(): void {
        this.permissionControls.forEach((control) => control.setValue(false));
    }

    resetForm(): void {
        this.form.reset({
            name: "",
            description: "",
        });
        this.clearAll();
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
        const entry: RoleEntry = {
            name: v.name,
            description: v.description,
            permissions: this.allPermissionNames.filter((_, index) => this.permissionControls[index].value),
        };

        setTimeout(() => {
            console.log("Role created:", entry);
            this.isSaving = false;
            this.router.navigate(["/management/roles"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/management/roles"]);
    }
}
