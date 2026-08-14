import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ChevronRight,
    CircleAlert,
    Hash,
    Mail,
    MapPin,
    RefreshCw,
    Save,
    ShoppingBag,
    Store,
    Tag,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Supplier, SupplierStatus } from "../../../../shared/models";
import { SuppliersService } from "../suppliers.service";

@Component({
    selector: "app-edit-supplier",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-supplier.component.html",
})
export class EditSupplierComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(SuppliersService);

    record: Supplier | null = null;

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        chevronRight: ChevronRight,
        store: Store,
        contact: UserRound,
        mail: Mail,
        mapPin: MapPin,
        categories: Tag,
        orders: ShoppingBag,
        hash: Hash,
        status: Tag,
        alert: CircleAlert,
    };

    statuses: SupplierStatus[] = ["Active", "Inactive"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        name: ["", Validators.required],
        contact: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        location: [""],
        categories: [""],
        orders: [0, [Validators.required, Validators.min(0)]],
        status: ["Active"],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/purchase/suppliers"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            name: record.name,
            contact: record.contact,
            email: record.email,
            location: record.location,
            categories: record.categories,
            orders: record.orders,
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
        if (controlName === "name") return "Supplier name is required";
        if (controlName === "contact") return "Contact person is required";
        if (controlName === "email") {
            if (errors["required"]) return "Email is required";
            if (errors["email"]) return "Please enter a valid email address";
        }
        if (controlName === "orders") {
            if (errors["required"]) return "Orders count is required";
            if (errors["min"]) return "Orders cannot be negative";
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
            contact: this.record.contact,
            email: this.record.email,
            location: this.record.location,
            categories: this.record.categories,
            orders: this.record.orders,
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
            contact: v.contact,
            email: v.email,
            location: v.location,
            categories: v.categories,
            orders: Number(v.orders),
            status: v.status as SupplierStatus,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/purchase/suppliers"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/purchase/suppliers"]);
    }
}
