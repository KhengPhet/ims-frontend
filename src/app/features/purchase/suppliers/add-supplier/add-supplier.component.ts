import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Building2,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    Clock,
    Globe,
    Hash,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Save,
    ShieldCheck,
    Store,
    Truck,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { ToggleComponent } from "../../../../shared/components/toggle/toggle.component";
import { Supplier, SupplierStatus } from "../../../../shared/models";
import { SuppliersService } from "../suppliers.service";

@Component({
    selector: "app-add-supplier",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent, ToggleComponent],
    templateUrl: "./add-supplier.component.html",
})
export class AddSupplierComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly service = inject(SuppliersService);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        store: Store,
        contact: UserRound,
        mail: Mail,
        phone: Phone,
        company: Building2,
        address: MapPin,
        globe: Globe,
        hash: Hash,
        truck: Truck,
        clock: Clock,
        shield: ShieldCheck,
        alert: CircleAlert,
    };

    statuses: SupplierStatus[] = ["Active", "Inactive"];
    countries = ["United States", "United Kingdom", "Canada", "Germany", "France", "India", "Australia", "Japan", "Singapore", "Other"];
    paymentTerms = ["Net 15", "Net 30", "Net 60", "Due on Receipt", "COD"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        contact: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: [""],
        website: [""],
        address: [""],
        city: [""],
        state: [""],
        zip: [""],
        country: [""],
        taxId: [""],
        categories: [""],
        leadTime: [7, [Validators.min(0)]],
        paymentTerms: ["Net 30"],
        notes: [""],
        status: ["Active"],
        primarySupplier: [true],
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
            if (errors["required"]) return "Supplier name is required";
            if (errors["minlength"]) return "Name must be at least 2 characters";
        }
        if (controlName === "contact") {
            if (errors["required"]) return "Contact person is required";
        }
        if (controlName === "email") {
            if (errors["required"]) return "Email is required";
            if (errors["email"]) return "Please enter a valid email address";
        }
        if (controlName === "leadTime") return "Lead time cannot be negative";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    resetForm(): void {
        this.form.reset({
            name: "",
            contact: "",
            email: "",
            phone: "",
            website: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            taxId: "",
            categories: "",
            leadTime: 7,
            paymentTerms: "Net 30",
            notes: "",
            status: "Active",
            primarySupplier: true,
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
        const record: Omit<Supplier, "id"> = {
            name: v.name,
            contact: v.contact,
            email: v.email,
            location: this.toLocation(v.city, v.state, v.country),
            categories: v.categories || "General",
            orders: 0,
            status: v.status as SupplierStatus,
        };

        this.service.create(record);

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/purchase/suppliers"]);
        }, 1200);
    }

    toLocation(city: string, state: string, country: string): string {
        const parts = [city, state].filter(Boolean);
        if (parts.length) {
            return `${parts.join(", ")}${country ? `, ${country}` : ""}`;
        }
        return country || "";
    }

    onCancel(): void {
        this.router.navigate(["/purchase/suppliers"]);
    }
}
