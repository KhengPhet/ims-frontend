import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ChevronRight,
    CircleAlert,
    DollarSign,
    Hash,
    Mail,
    Phone,
    RefreshCw,
    Save,
    ShoppingBag,
    Tag,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Customer, CustomerStatus } from "../../../../shared/models";
import { CustomersService } from "../customers.service";

@Component({
    selector: "app-edit-customer",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-customer.component.html",
})
export class EditCustomerComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(CustomersService);

    record: Customer | null = null;

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        chevronRight: ChevronRight,
        user: UserRound,
        mail: Mail,
        phone: Phone,
        status: Tag,
        bag: ShoppingBag,
        dollar: DollarSign,
        hash: Hash,
        alert: CircleAlert,
    };

    statuses: CustomerStatus[] = ["New", "Active", "Inactive"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        phone: [""],
        status: ["New"],
        orders: [0, [Validators.required, Validators.min(0)]],
        totalSpent: [0, [Validators.required, Validators.min(0)]],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/sales/customers"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            name: record.name,
            email: record.email,
            phone: record.phone,
            status: record.status,
            orders: record.orders,
            totalSpent: record.totalSpent,
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
        if (controlName === "orders") {
            if (errors["required"]) return "Orders count is required";
            if (errors["min"]) return "Orders cannot be negative";
        }
        if (controlName === "totalSpent") {
            if (errors["required"]) return "Total spent is required";
            if (errors["min"]) return "Total spent cannot be negative";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    resetForm(): void {
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            name: this.record.name,
            email: this.record.email,
            phone: this.record.phone,
            status: this.record.status,
            orders: this.record.orders,
            totalSpent: this.record.totalSpent,
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
            phone: v.phone,
            status: v.status as CustomerStatus,
            orders: Number(v.orders),
            totalSpent: Number(v.totalSpent),
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/sales/customers"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/sales/customers"]);
    }
}
