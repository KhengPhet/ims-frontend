import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    DollarSign,
    Package,
    RefreshCw,
    Save,
    Store,
    Tag,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { PurchaseOrder, PurchaseOrderStatus } from "../../../../shared/models";
import { PurchaseOrdersService } from "../purchase-orders.service";

@Component({
    selector: "app-edit-purchase-order",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-purchase-order.component.html",
})
export class EditPurchaseOrderComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(PurchaseOrdersService);

    record: PurchaseOrder | null = null;

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        list: ClipboardList,
        supplier: Store,
        calendar: CalendarDays,
        items: Package,
        dollar: DollarSign,
        status: Tag,
        alert: CircleAlert,
    };

    suppliers = [
        "TechSource Wholesale",
        "Northwind Paper Co.",
        "Pacific Supply Group",
        "Metro Distribution",
        "BlueOak Wholesale",
        "Zenith Imports",
        "Summit Office Supplies",
        "EcoDistributors",
        "Harmony Products",
    ];

    statuses: PurchaseOrderStatus[] = ["Pending", "Approved", "In Transit", "Received", "Cancelled"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        poNumber: ["", Validators.required],
        supplier: ["", Validators.required],
        orderDate: [new Date().toISOString().slice(0, 10), Validators.required],
        expectedDate: [new Date().toISOString().slice(0, 10), Validators.required],
        items: [0, [Validators.required, Validators.min(0)]],
        total: [0, [Validators.required, Validators.min(0)]],
        status: ["Pending"],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/purchase/orders"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            poNumber: record.poNumber,
            supplier: record.supplier,
            orderDate: this.toInputDate(record.orderDate),
            expectedDate: this.toInputDate(record.expectedDate),
            items: record.items,
            total: record.total,
            status: record.status,
        });
    }

    toInputDate(value: string): string {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
    }

    toDisplayDate(value: string): string {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
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
        if (controlName === "poNumber") return "PO number is required";
        if (controlName === "supplier") return "Please select a supplier";
        if (controlName === "orderDate") return "Order date is required";
        if (controlName === "expectedDate") return "Expected date is required";
        if (controlName === "items") {
            if (errors["required"]) return "Item count is required";
            if (errors["min"]) return "Item count cannot be negative";
        }
        if (controlName === "total") {
            if (errors["required"]) return "Total is required";
            if (errors["min"]) return "Total cannot be negative";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    generateReference(): void {
        const year = new Date().getFullYear();
        const seq = Math.floor(1000 + Math.random() * 9000);
        this.form.controls.poNumber.setValue(`PO-${year}-${seq}`);
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    resetForm(): void {
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            poNumber: this.record.poNumber,
            supplier: this.record.supplier,
            orderDate: this.toInputDate(this.record.orderDate),
            expectedDate: this.toInputDate(this.record.expectedDate),
            items: this.record.items,
            total: this.record.total,
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
            poNumber: v.poNumber,
            supplier: v.supplier,
            orderDate: this.toDisplayDate(v.orderDate),
            expectedDate: this.toDisplayDate(v.expectedDate),
            items: Number(v.items),
            total: Number(v.total),
            status: v.status as PurchaseOrderStatus,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/purchase/orders"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/purchase/orders"]);
    }
}
