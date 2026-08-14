import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
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
    Warehouse,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { SelectableProduct, StockOutEntry, TransactionStatus } from "../../../../shared/models";

@Component({
    selector: "app-add-stock-out",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./add-stock-out.component.html",
})
export class AddStockOutComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    icons = {
        save: Save,
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
    statuses: TransactionStatus[] = ["Pending", "Completed"];

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
        this.form.reset({
            reference: "",
            product: "",
            sku: "",
            quantity: 1,
            unit: "",
            destination: "",
            warehouse: "",
            issuedDate: new Date().toISOString().slice(0, 10),
            reason: "",
            status: "Pending",
        });
        this.generateReference();
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
        const entry: StockOutEntry = {
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
        };

        setTimeout(() => {
            console.log("Stock Out created:", entry);
            this.isSaving = false;
            this.router.navigate(["/inventory/stock-out"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/inventory/stock-out"]);
    }
}
