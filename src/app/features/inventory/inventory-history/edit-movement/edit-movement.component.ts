import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ArrowDownToLine,
    ArrowUpFromLine,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    History,
    Package,
    RefreshCw,
    Save,
    Send,
    SquarePen,
    Truck,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { SelectableProduct, StockTransaction, TransactionStatus, TransactionType } from "../../../../shared/models";
import { InventoryHistoryService } from "../inventory-history.service";

@Component({
    selector: "app-edit-movement",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-movement.component.html",
})
export class EditMovementComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(InventoryHistoryService);

    record: StockTransaction | null = null;

    icons = {
        save: Save,
        edit: SquarePen,
        x: X,
        refresh: RefreshCw,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        history: History,
        arrowDown: ArrowDownToLine,
        arrowUp: ArrowUpFromLine,
        package: Package,
        user: UserRound,
        supplier: Truck,
        send: Send,
        calendar: CalendarDays,
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

    suppliers = ["Logitech Distribution", "Herman Miller Wholesale", "Philips Lighting", "Moleskine Partners", "JBL Distributor", "UGREEN Supply Co.", "Double A Imports", "Hydro Flask Retail"];
    destinations = ["Online Store — Wholesale", "Retail Shop — Downtown", "Retail Shop — Mall", "Retail Shop — Airport", "Warehouse B — Cross-dock", "Maintenance — Office fit-out", "Corporate — Operations"];
    types: TransactionType[] = ["Stock In", "Stock Out", "Adjustment"];
    statuses: TransactionStatus[] = ["Pending", "Completed", "Cancelled"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        reference: ["", Validators.required],
        type: ["Stock In", Validators.required],
        product: ["", Validators.required],
        sku: [{ value: "", disabled: true }],
        quantity: [1, Validators.required],
        user: ["", Validators.required],
        date: [new Date().toISOString().slice(0, 10), Validators.required],
        status: ["Pending"],
        supplier: [""],
        destination: [""],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/inventory/history"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            reference: record.reference,
            type: record.type,
            product: record.product,
            sku: record.sku,
            quantity: record.quantity,
            user: record.user,
            date: this.toInputDate(record.date),
            status: record.status,
            supplier: record.supplier ?? "",
            destination: record.destination ?? "",
        });
    }

    get selectedProduct(): SelectableProduct | undefined {
        const name = this.form.controls.product.value;
        return this.products.find((p) => p.name === name);
    }

    get isStockIn(): boolean {
        return this.form.controls.type.value === "Stock In";
    }

    get isStockOut(): boolean {
        return this.form.controls.type.value === "Stock Out";
    }

    onProductChange(): void {
        const product = this.selectedProduct;
        this.form.controls.sku.setValue(product?.sku ?? "");
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

    signedQuantity(value: number): string {
        const sign = value < 0 ? "" : "+";
        return `${sign}${value.toLocaleString()}`;
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
        if (controlName === "product") return "Please select a product";
        if (controlName === "reference") return "Reference is required";
        if (controlName === "quantity") return "Quantity is required";
        if (controlName === "user") return "User is required";
        if (controlName === "date") return "Date is required";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    generateReference(): void {
        const year = new Date().getFullYear();
        const seq = Math.floor(1000 + Math.random() * 9000);
        const type = this.form.controls.type.value;
        const prefix = type === "Stock In" ? "IN" : type === "Stock Out" ? "OUT" : "ADJ";
        this.form.controls.reference.setValue(`${prefix}-${year}-${seq}`);
    }

    resetForm(): void {
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            reference: this.record.reference,
            type: this.record.type,
            product: this.record.product,
            sku: this.record.sku,
            quantity: this.record.quantity,
            user: this.record.user,
            date: this.toInputDate(this.record.date),
            status: this.record.status,
            supplier: this.record.supplier ?? "",
            destination: this.record.destination ?? "",
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
            type: v.type as TransactionType,
            product: v.product,
            sku: v.sku,
            quantity: Number(v.quantity),
            user: v.user,
            date: this.toDisplayDate(v.date),
            status: v.status as TransactionStatus,
            supplier: this.isStockIn ? v.supplier : undefined,
            destination: this.isStockOut ? v.destination : undefined,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/inventory/history"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/inventory/history"]);
    }
}
