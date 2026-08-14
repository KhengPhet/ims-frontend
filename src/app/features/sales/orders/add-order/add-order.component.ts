import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    CreditCard,
    DollarSign,
    LoaderCircle,
    Mail,
    Package,
    Plus,
    RefreshCw,
    Save,
    ShoppingBag,
    Tag,
    Trash2,
    Truck,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Order, OrderItem, OrderStatus, SelectableProduct } from "../../../../shared/models";
import { OrdersService } from "../orders.service";

interface OrderItemControls {
    product: FormControl<string>;
    sku: FormControl<string>;
    quantity: FormControl<number>;
    unitPrice: FormControl<number>;
}

interface CustomerOption {
    name: string;
    email: string;
}

@Component({
    selector: "app-add-order",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./add-order.component.html",
})
export class AddOrderComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly service = inject(OrdersService);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        bag: ShoppingBag,
        package: Package,
        customer: UserRound,
        mail: Mail,
        calendar: CalendarDays,
        status: Tag,
        payment: CreditCard,
        dollar: DollarSign,
        truck: Truck,
        plus: Plus,
        trash: Trash2,
        alert: CircleAlert,
    };

    customers: CustomerOption[] = [
        { name: "Sarah Johnson", email: "sarah.johnson@mail.com" },
        { name: "James Miller", email: "j.miller@corp.io" },
        { name: "Emily Davis", email: "emily.d@studio.com" },
        { name: "Michael Brown", email: "mbrown@builders.co" },
        { name: "Olivia Wilson", email: "olivia.w@mail.com" },
        { name: "Daniel Taylor", email: "d.taylor@tech.io" },
        { name: "Sophia Martinez", email: "sophia.m@mail.com" },
        { name: "Ethan Anderson", email: "e.anderson@mail.com" },
        { name: "Ava Rodriguez", email: "ava.r@mail.com" },
        { name: "Liam Walker", email: "liam.w@build.io" },
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

    statuses: OrderStatus[] = ["Pending", "Processing", "Completed"];
    payments = ["Pending", "Paid", "Refunded"];

    isSaving = false;

    items = this.fb.array<FormGroup<OrderItemControls>>([]);

    form = this.fb.nonNullable.group({
        orderNumber: ["", Validators.required],
        customer: ["", Validators.required],
        email: [{ value: "", disabled: true }],
        orderDate: [new Date().toISOString().slice(0, 10), Validators.required],
        status: ["Pending"],
        payment: ["Pending"],
        shipping: [0, [Validators.min(0)]],
        taxRate: [0, [Validators.min(0), Validators.max(100)]],
        notes: [""],
        items: this.items,
    });

    get itemControls(): FormGroup<OrderItemControls>[] {
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

    lineTotal(item: FormGroup<OrderItemControls>): number {
        const qty = Number(item.controls.quantity.value) || 0;
        const price = Number(item.controls.unitPrice.value) || 0;
        return Math.round(qty * price * 100) / 100;
    }

    onCustomerChange(): void {
        const customer = this.customers.find((c) => c.name === this.form.controls.customer.value);
        this.form.controls.email.setValue(customer?.email ?? "");
    }

    onItemProductChange(index: number): void {
        const item = this.items.at(index);
        const product = this.products.find((p) => p.name === item.controls.product.value);
        item.controls.sku.setValue(product?.sku ?? "");
        if (product && Number(item.controls.unitPrice.value) === 0) {
            item.controls.unitPrice.setValue(product.price);
        }
    }

    addItem(): void {
        this.items.push(
            this.fb.nonNullable.group({
                product: ["", Validators.required],
                sku: [""],
                quantity: [1, [Validators.required, Validators.min(1)]],
                unitPrice: [0, [Validators.required, Validators.min(0)]],
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
        if (controlName === "orderNumber") return "Order number is required";
        if (controlName === "customer") return "Please select a customer";
        if (controlName === "orderDate") return "Order date is required";
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

    itemError(item: FormGroup<OrderItemControls>, control: string): string {
        const controlRef = item.controls[control as keyof OrderItemControls];
        if (!controlRef || !controlRef.errors || (!controlRef.touched && !controlRef.dirty)) {
            return "";
        }
        if (control === "product") return "Select a product";
        if (control === "quantity") {
            if (controlRef.errors["required"]) return "Required";
            if (controlRef.errors["min"]) return "Min 1";
        }
        if (control === "unitPrice") {
            if (controlRef.errors["required"]) return "Required";
            if (controlRef.errors["min"]) return "Cannot be negative";
        }
        return "Invalid";
    }

    generateReference(): void {
        const year = new Date().getFullYear();
        const seq = Math.floor(1000 + Math.random() * 9000);
        this.form.controls.orderNumber.setValue(`ORD-${year}-${seq}`);
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    resetForm(): void {
        this.form.reset({
            orderNumber: "",
            customer: "",
            email: "",
            orderDate: new Date().toISOString().slice(0, 10),
            status: "Pending",
            payment: "Pending",
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
        const orderItems: OrderItem[] = this.items.controls.map((item) => ({
            product: item.controls.product.value,
            sku: item.controls.sku.value,
            quantity: Number(item.controls.quantity.value),
            unitPrice: Number(item.controls.unitPrice.value),
            total: this.lineTotal(item),
        }));

        const record: Omit<Order, "id"> = {
            orderNumber: v.orderNumber,
            customer: v.customer,
            email: v.email,
            date: this.toDisplayDate(v.orderDate),
            items: orderItems.length,
            total: Math.round(this.grandTotal * 100) / 100,
            payment: v.payment,
            status: v.status as OrderStatus,
        };

        this.service.create(record);

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/sales/orders"]);
        }, 1200);
    }

    toDisplayDate(value: string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        const display = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        return `${display} · ${time}`;
    }

    onCancel(): void {
        this.router.navigate(["/sales/orders"]);
    }
}
