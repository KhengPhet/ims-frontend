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
    Receipt,
    RefreshCw,
    Save,
    Tag,
    Trash2,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { InvoiceEntry, InvoiceItem, InvoiceStatus, SelectableProduct } from "../../../../shared/models";

interface InvoiceItemControls {
    product: FormControl<string>;
    description: FormControl<string>;
    quantity: FormControl<number>;
    unitPrice: FormControl<number>;
}

interface CustomerOption {
    name: string;
    email: string;
}

@Component({
    selector: "app-add-invoice",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./add-invoice.component.html",
})
export class AddInvoiceComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    icons = {
        save: Save,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        receipt: Receipt,
        package: Package,
        customer: UserRound,
        mail: Mail,
        calendar: CalendarDays,
        status: Tag,
        payment: CreditCard,
        dollar: DollarSign,
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

    statuses: InvoiceStatus[] = ["Draft", "Pending", "Paid", "Overdue"];
    paymentTermsList = ["Due on Receipt", "Net 7", "Net 15", "Net 30", "Net 45", "Net 60"];

    isSaving = false;

    items = this.fb.array<FormGroup<InvoiceItemControls>>([]);

    form = this.fb.nonNullable.group({
        invoiceNumber: ["", Validators.required],
        customer: ["", Validators.required],
        email: [{ value: "", disabled: true }],
        issueDate: [new Date().toISOString().slice(0, 10), Validators.required],
        dueDate: [{ value: "", disabled: true }],
        paymentTerms: ["Net 30"],
        status: ["Draft"],
        taxRate: [0, [Validators.min(0), Validators.max(100)]],
        notes: [""],
        items: this.items,
    });

    get itemControls(): FormGroup<InvoiceItemControls>[] {
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
        return this.subtotal + this.taxAmount;
    }

    lineTotal(item: FormGroup<InvoiceItemControls>): number {
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
        if (product) {
            item.controls.description.setValue(product.name);
            if (Number(item.controls.unitPrice.value) === 0) {
                item.controls.unitPrice.setValue(product.price);
            }
        }
    }

    daysForTerms(terms: string): number {
        const match = terms.match(/Net (\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    recalculateDueDate(): void {
        const issueDate = this.form.controls.issueDate.value;
        if (!issueDate) {
            return;
        }
        const days = this.daysForTerms(this.form.controls.paymentTerms.value);
        const date = new Date(issueDate);
        date.setDate(date.getDate() + days);
        this.form.controls.dueDate.setValue(date.toISOString().slice(0, 10));
    }

    onIssueDateChange(): void {
        this.recalculateDueDate();
    }

    onPaymentTermsChange(): void {
        this.recalculateDueDate();
    }

    addItem(): void {
        this.items.push(
            this.fb.nonNullable.group({
                product: ["", Validators.required],
                description: [""],
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
        if (controlName === "invoiceNumber") return "Invoice number is required";
        if (controlName === "customer") return "Please select a customer";
        if (controlName === "issueDate") return "Issue date is required";
        if (controlName === "taxRate") {
            if (errors["min"]) return "Tax rate must be at least 0";
            if (errors["max"]) return "Tax rate cannot exceed 100";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    itemError(item: FormGroup<InvoiceItemControls>, control: string): string {
        const controlRef = item.controls[control as keyof InvoiceItemControls];
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
        this.form.controls.invoiceNumber.setValue(`INV-${year}-${seq}`);
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    resetForm(): void {
        const today = new Date().toISOString().slice(0, 10);
        this.form.reset({
            invoiceNumber: "",
            customer: "",
            email: "",
            issueDate: today,
            dueDate: today,
            paymentTerms: "Net 30",
            status: "Draft",
            taxRate: 0,
            notes: "",
        });
        this.items.clear();
        this.addItem();
        this.generateReference();
        this.recalculateDueDate();
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
        const invoiceItems: InvoiceItem[] = this.items.controls.map((item) => ({
            product: item.controls.product.value,
            description: item.controls.description.value,
            quantity: Number(item.controls.quantity.value),
            unitPrice: Number(item.controls.unitPrice.value),
            total: this.lineTotal(item),
        }));

        const entry: InvoiceEntry = {
            invoiceNumber: v.invoiceNumber,
            customer: v.customer,
            email: v.email,
            issueDate: v.issueDate,
            dueDate: v.dueDate,
            paymentTerms: v.paymentTerms,
            status: v.status as InvoiceStatus,
            items: invoiceItems,
            subtotal: this.subtotal,
            taxRate: v.taxRate,
            taxAmount: this.taxAmount,
            grandTotal: this.grandTotal,
            notes: v.notes,
        };

        setTimeout(() => {
            console.log("Invoice created:", entry);
            this.isSaving = false;
            this.router.navigate(["/sales/invoice"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/sales/invoice"]);
    }
}
