import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    CreditCard,
    LoaderCircle,
    Mail,
    Package,
    Phone,
    Plus,
    RefreshCw,
    Save,
    ShoppingCart,
    Store,
    Tag,
    Trash2,
    Truck,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus, SelectableProduct } from "../../../../shared/models";
import { PurchaseOrdersService } from "../purchase-orders.service";

interface PurchaseOrderItemControls {
    product: FormControl<string>;
    sku: FormControl<string>;
    quantity: FormControl<number>;
    unitCost: FormControl<number>;
}

interface SupplierOption {
    name: string;
    contact: string;
    email: string;
}

@Component({
    selector: "app-add-purchase-order",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./add-purchase-order.component.html",
})
export class AddPurchaseOrderComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly service = inject(PurchaseOrdersService);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        bag: ShoppingCart,
        list: ClipboardList,
        package: Package,
        supplier: Store,
        contact: UserRound,
        mail: Mail,
        phone: Phone,
        calendar: CalendarDays,
        status: Tag,
        payment: CreditCard,
        truck: Truck,
        plus: Plus,
        trash: Trash2,
        alert: CircleAlert,
    };

    suppliers: SupplierOption[] = [
        { name: "TechSource Wholesale", contact: "Robert Lee", email: "sales@techsource.io" },
        { name: "Northwind Paper Co.", contact: "Helen Cooper", email: "orders@northwindpaper.com" },
        { name: "Pacific Supply Group", contact: "Kenji Tanaka", email: "contact@pacificsg.com" },
        { name: "Metro Distribution", contact: "Anna Petrova", email: "info@metrodist.eu" },
        { name: "BlueOak Wholesale", contact: "Grace Kim", email: "sales@blueoak.co" },
        { name: "Zenith Imports", contact: "Luis Garcia", email: "support@zenithimports.com" },
        { name: "Summit Office Supplies", contact: "Jack Turner", email: "jack@summitoffice.com" },
        { name: "EcoDistributors", contact: "Mia Chen", email: "mia@ecodist.com" },
        { name: "Harmony Products", contact: "Nina Kowalski", email: "nina@harmonyprod.pl" },
    ];

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

    statuses: PurchaseOrderStatus[] = ["Pending", "Approved", "In Transit", "Received", "Cancelled"];
    paymentTerms = ["Net 15", "Net 30", "Net 60", "Due on Receipt", "COD"];

    isSaving = false;

    items = this.fb.array<FormGroup<PurchaseOrderItemControls>>([]);

    form = this.fb.nonNullable.group({
        poNumber: ["", Validators.required],
        supplier: ["", Validators.required],
        contact: [{ value: "", disabled: true }],
        email: [{ value: "", disabled: true }],
        orderDate: [new Date().toISOString().slice(0, 10), Validators.required],
        expectedDate: [new Date().toISOString().slice(0, 10), Validators.required],
        status: ["Pending"],
        paymentTerms: ["Net 30"],
        shipping: [0, [Validators.min(0)]],
        taxRate: [0, [Validators.min(0), Validators.max(100)]],
        notes: [""],
        items: this.items,
    });

    get itemControls(): FormGroup<PurchaseOrderItemControls>[] {
        return this.items.controls;
    }

    get itemCount(): number {
        return this.items.length;
    }

    get subtotal(): number {
        return this.items.controls.reduce((sum, item) => sum + this.lineTotal(item), 0);
    }

    get taxAmount(): number {
        return (this.subtotal * (this.form.controls.taxRate.value || 0)) / 100;
    }

    get grandTotal(): number {
        return this.subtotal + this.taxAmount + (this.form.controls.shipping.value || 0);
    }

    lineTotal(item: FormGroup<PurchaseOrderItemControls>): number {
        const qty = Number(item.controls.quantity.value) || 0;
        const cost = Number(item.controls.unitCost.value) || 0;
        return Math.round(qty * cost * 100) / 100;
    }

    onSupplierChange(): void {
        const supplier = this.suppliers.find((s) => s.name === this.form.controls.supplier.value);
        this.form.controls.contact.setValue(supplier?.contact ?? "");
        this.form.controls.email.setValue(supplier?.email ?? "");
    }

    onItemProductChange(index: number): void {
        const item = this.items.at(index);
        const product = this.products.find((p) => p.name === item.controls.product.value);
        item.controls.sku.setValue(product?.sku ?? "");
        if (product && Number(item.controls.unitCost.value) === 0) {
            item.controls.unitCost.setValue(product.price);
        }
    }

    addItem(): void {
        this.items.push(
            this.fb.nonNullable.group({
                product: ["", Validators.required],
                sku: [""],
                quantity: [1, [Validators.required, Validators.min(1)]],
                unitCost: [0, [Validators.required, Validators.min(0)]],
            })
        );
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
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
        if (controlName === "shipping") return "Shipping cannot be negative";
        if (controlName === "taxRate") {
            if (errors["min"]) return "Tax rate must be at least 0";
            if (errors["max"]) return "Tax rate cannot exceed 100";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    itemError(item: FormGroup<PurchaseOrderItemControls>, control: string): string {
        const controlRef = item.controls[control as keyof PurchaseOrderItemControls];
        if (!controlRef || !controlRef.errors || (!controlRef.touched && !controlRef.dirty)) {
            return "";
        }
        if (control === "product") return "Select a product";
        if (control === "quantity") {
            if (controlRef.errors["required"]) return "Required";
            if (controlRef.errors["min"]) return "Min 1";
        }
        if (control === "unitCost") {
            if (controlRef.errors["required"]) return "Required";
            if (controlRef.errors["min"]) return "Cannot be negative";
        }
        return "Invalid";
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
        this.form.reset({
            poNumber: "",
            supplier: "",
            contact: "",
            email: "",
            orderDate: new Date().toISOString().slice(0, 10),
            expectedDate: new Date().toISOString().slice(0, 10),
            status: "Pending",
            paymentTerms: "Net 30",
            shipping: 0,
            taxRate: 0,
            notes: "",
        });
        this.items.clear();
        this.addItem();
        this.generateReference();
    }

    onSubmit(): void {
        if (this.form.invalid || this.items.length === 0) {
            this.form.markAllAsTouched();
            this.items.controls.forEach((item) => item.markAllAsTouched());
            return;
        }
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;

        const v = this.form.getRawValue();
        const orderItems: PurchaseOrderItem[] = this.items.controls.map((item) => ({
            product: item.controls.product.value,
            sku: item.controls.sku.value,
            quantity: Number(item.controls.quantity.value),
            unitCost: Number(item.controls.unitCost.value),
            total: this.lineTotal(item),
        }));

        const record: Omit<PurchaseOrder, "id"> = {
            poNumber: v.poNumber,
            supplier: v.supplier,
            items: orderItems.length,
            total: Math.round(this.grandTotal * 100) / 100,
            orderDate: this.toDisplayDate(v.orderDate),
            expectedDate: this.toDisplayDate(v.expectedDate),
            status: v.status as PurchaseOrderStatus,
        };

        this.service.create(record);

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/purchase/orders"]);
        }, 1200);
    }

    toDisplayDate(value: string): string {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    }

    onCancel(): void {
        this.router.navigate(["/purchase/orders"]);
    }
}
