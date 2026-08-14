import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ArrowUpFromLine,
    Boxes,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    FileText,
    LoaderCircle,
    MapPin,
    Package,
    RefreshCw,
    Save,
    Send,
    ShoppingCart,
    SquarePen,
    Warehouse,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { SelectableProduct, StockOutRecord, TransactionStatus } from "../../../../shared/models";
import { StockOutService } from "../stock-out.service";

@Component({
    selector: "app-edit-stock-out",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-stock-out.component.html",
})
export class EditStockOutComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(StockOutService);

    record: StockOutRecord | null = null;

    icons = {
        save: Save,
        edit: SquarePen,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        arrowUp: ArrowUpFromLine,
        package: Package,
        boxes: Boxes,
        cart: ShoppingCart,
        send: Send,
        warehouse: Warehouse,
        location: MapPin,
        calendar: CalendarDays,
        notes: FileText,
        alert: CircleAlert,
    };

    products: SelectableProduct[] = [
        { name: "Wireless Mouse MX", sku: "PRD-1024", unit: "pcs", price: 39.99, stock: 156 },
        { name: "USB-C Cable 2m", sku: "PRD-2088", unit: "pcs", price: 12.5, stock: 12 },
        { name: "A4 Paper Ream", sku: "PRD-3351", unit: "ream", price: 8.75, stock: 18 },
        { name: "Stainless Bottle 1L", sku: "PRD-4410", unit: "pcs", price: 32.0, stock: 0 },
        { name: "HDMI Cable 1.5m", sku: "PRD-1187", unit: "pcs", price: 9.9, stock: 9 },
        { name: "Office Chair Ergo", sku: "PRD-5562", unit: "pcs", price: 429.0, stock: 34 },
        { name: "Desk Lamp LED", sku: "PRD-6630", unit: "pcs", price: 54.25, stock: 120 },
        { name: "Notebook A5 Grid", sku: "PRD-7718", unit: "pcs", price: 16.9, stock: 240 },
        { name: "Bluetooth Speaker", sku: "PRD-8844", unit: "pcs", price: 89.0, stock: 58 },
    ];

    destinations = ["Online Store — Wholesale", "Retail Shop — Downtown", "Retail Shop — Mall", "Retail Shop — Airport", "Warehouse B — Cross-dock", "Maintenance — Office fit-out", "Corporate — Operations"];
    warehouses = ["Main Warehouse", "Secondary Warehouse", "West Storage", "East Storage"];
    statuses: TransactionStatus[] = ["Pending", "Completed", "Cancelled"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        reference: ["", Validators.required],
        product: ["", Validators.required],
        sku: [{ value: "", disabled: true }],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unit: [{ value: "", disabled: true }],
        destination: ["", Validators.required],
        warehouse: ["", Validators.required],
        issuedDate: [new Date().toISOString().slice(0, 10), Validators.required],
        reason: [""],
        status: ["Pending"],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/inventory/stock-out"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            reference: record.reference,
            product: record.product,
            sku: record.sku,
            quantity: record.quantity,
            unit: record.unit,
            destination: record.destination ?? "",
            warehouse: record.warehouse ?? "",
            issuedDate: record.issuedDate ?? new Date().toISOString().slice(0, 10),
            reason: record.reason ?? "",
            status: record.status,
        });
    }

    get selectedProduct(): SelectableProduct | undefined {
        const name = this.form.controls.product.value;
        return this.products.find((p) => p.name === name);
    }

    get availableStock(): number {
        return this.selectedProduct?.stock ?? 0;
    }

    onProductChange(): void {
        const product = this.selectedProduct;
        this.form.controls.sku.setValue(product?.sku ?? "");
        this.form.controls.unit.setValue(product?.unit ?? "");
        if (product && Number(this.form.controls.quantity.value) === 0) {
            this.form.controls.quantity.setValue(1);
        }
        this.validateQuantity();
    }

    get quantityExceedsStock(): boolean {
        return this.form.controls.quantity.value > this.availableStock;
    }

    get stockRemaining(): number {
        return Math.max(0, this.availableStock - (this.form.controls.quantity.value || 0));
    }

    get issueValue(): number {
        return (this.selectedProduct?.price ?? 0) * (this.form.controls.quantity.value || 0);
    }

    validateQuantity(): void {
        const quantity = this.form.controls.quantity;
        if (this.availableStock > 0 && quantity.value > this.availableStock) {
            quantity.setErrors({ max: { max: this.availableStock } });
        } else if (quantity.hasError("max")) {
            if (Object.keys(quantity.errors ?? {}).length === 1) {
                quantity.setErrors(null);
            }
        }
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
        if (controlName === "product") return "Please select a product";
        if (controlName === "reference") return "Reference is required";
        if (controlName === "quantity") {
            if (errors["required"]) return "Quantity is required";
            if (errors["min"]) return "Quantity must be at least 1";
            if (errors["max"]) return "Quantity cannot exceed available stock";
        }
        if (controlName === "destination") return "Please select a destination";
        if (controlName === "warehouse") return "Please select a warehouse";
        if (controlName === "issuedDate") return "Issue date is required";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    generateReference(): void {
        const year = new Date().getFullYear();
        const seq = Math.floor(1000 + Math.random() * 9000);
        this.form.controls.reference.setValue(`OUT-${year}-${seq}`);
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    resetForm(): void {
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            reference: this.record.reference,
            product: this.record.product,
            sku: this.record.sku,
            quantity: this.record.quantity,
            unit: this.record.unit,
            destination: this.record.destination ?? "",
            warehouse: this.record.warehouse ?? "",
            issuedDate: this.record.issuedDate ?? new Date().toISOString().slice(0, 10),
            reason: this.record.reason ?? "",
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
            reference: v.reference,
            product: v.product,
            sku: v.sku,
            quantity: Number(v.quantity),
            unit: v.unit,
            destination: v.destination,
            warehouse: v.warehouse,
            issuedDate: v.issuedDate,
            reason: v.reason,
            status: v.status as TransactionStatus,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/inventory/stock-out"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/inventory/stock-out"]);
    }
}
