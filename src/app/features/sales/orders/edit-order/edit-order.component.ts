import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
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
    RefreshCw,
    Save,
    ShoppingBag,
    SquarePen,
    Tag,
    UserRound,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Order, OrderStatus } from "../../../../shared/models";
import { OrdersService } from "../orders.service";

interface CustomerOption {
    name: string;
    email: string;
}

@Component({
    selector: "app-edit-order",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./edit-order.component.html",
})
export class EditOrderComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(OrdersService);

    record: Order | null = null;

    icons = {
        save: Save,
        edit: SquarePen,
        x: X,
        refresh: RefreshCw,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        bag: ShoppingBag,
        customer: UserRound,
        mail: Mail,
        calendar: CalendarDays,
        status: Tag,
        payment: CreditCard,
        dollar: DollarSign,
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

    statuses: OrderStatus[] = ["Pending", "Processing", "Completed", "Refunded", "Cancelled"];
    payments = ["Pending", "Paid", "Refunded"];

    isSaving = false;

    form = this.fb.nonNullable.group({
        orderNumber: ["", Validators.required],
        customer: ["", Validators.required],
        email: [{ value: "", disabled: true }],
        orderDate: [new Date().toISOString().slice(0, 10), Validators.required],
        items: [0, [Validators.required, Validators.min(0)]],
        total: [0, [Validators.required, Validators.min(0)]],
        payment: ["Pending"],
        status: ["Pending"],
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        const record = id ? this.service.getById(id) : undefined;
        if (!record) {
            this.router.navigate(["/sales/orders"]);
            return;
        }
        this.record = record;
        this.form.patchValue({
            orderNumber: record.orderNumber,
            customer: record.customer,
            email: record.email,
            orderDate: this.toInputDate(record.date),
            items: record.items,
            total: record.total,
            payment: record.payment,
            status: record.status,
        });
    }

    onCustomerChange(): void {
        const customer = this.customers.find((c) => c.name === this.form.controls.customer.value);
        this.form.controls.email.setValue(customer?.email ?? "");
    }

    toInputDate(value: string): string {
        const datePart = value.split("·")[0].trim();
        const date = new Date(datePart);
        return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
    }

    toDisplayDate(value: string, original: string): string {
        const timePart = original.split("·")[1]?.trim();
        const date = new Date(value);
        const display = Number.isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        return timePart ? `${display} · ${timePart}` : display;
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
        if (controlName === "orderNumber") return "Order number is required";
        if (controlName === "customer") return "Please select a customer";
        if (controlName === "orderDate") return "Order date is required";
        if (controlName === "items") {
            if (control.errors["required"]) return "Item count is required";
            if (control.errors["min"]) return "Item count cannot be negative";
        }
        if (controlName === "total") {
            if (control.errors["required"]) return "Total is required";
            if (control.errors["min"]) return "Total cannot be negative";
        }
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
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
        if (!this.record) {
            return;
        }
        this.form.patchValue({
            orderNumber: this.record.orderNumber,
            customer: this.record.customer,
            email: this.record.email,
            orderDate: this.toInputDate(this.record.date),
            items: this.record.items,
            total: this.record.total,
            payment: this.record.payment,
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
            orderNumber: v.orderNumber,
            customer: v.customer,
            email: v.email,
            date: this.toDisplayDate(v.orderDate, this.record.date),
            items: Number(v.items),
            total: Number(v.total),
            payment: v.payment,
            status: v.status as OrderStatus,
        });

        setTimeout(() => {
            this.isSaving = false;
            this.router.navigate(["/sales/orders"]);
        }, 1200);
    }

    onCancel(): void {
        this.router.navigate(["/sales/orders"]);
    }
}
