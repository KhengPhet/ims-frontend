import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Building2,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    Globe,
    Hash,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Save,
    UserPlus,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { ToggleComponent } from "../../../../shared/components/toggle/toggle.component";
import { Customer, CustomerStatus } from "../../../../shared/models";
import { CustomersService } from "../customers.service";

@Component({
    selector: "app-add-customer",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent, ToggleComponent],
    templateUrl: "./add-customer.component.html",
})
export class AddCustomerComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly service = inject(CustomersService);

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
        company: Building2,
        address: MapPin,
        globe: Globe,
        hash: Hash,
        alert: CircleAlert,
    };

    statuses: CustomerStatus[] = ["New", "Active", "Inactive"];
    countries = ["United States", "United Kingdom", "Canada", "Germany", "France", "India", "Australia", "Japan", "Singapore", "Other"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        phone: [""],
        company: [""],
        address: [""],
        city: [""],
        state: [""],
        zip: [""],
        country: [""],
        taxId: [""],
        notes: [""],
        status: ["New"],
        sendWelcome: [true],
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
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    resetForm(): void {
        this.form.reset({
            name: "",
            email: "",
            phone: "",
            company: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            taxId: "",
            notes: "",
            status: "New",
            sendWelcome: true,
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
        const record: Omit<Customer, "id"> = {
            name: v.name,
            email: v.email,
            phone: v.phone,
            orders: 0,
            totalSpent: 0,
            status: v.status as CustomerStatus,
        };

        this.service.create(record);

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/sales/customers"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/sales/customers"]);
    }
}
