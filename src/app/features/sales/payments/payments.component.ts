import { Component } from "@angular/core";
import { LucideAngularModule, Download, CreditCard, Smartphone, Landmark, Wallet, LucideIconData } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { Payment, PaymentMethod, PaymentStatus } from "../../../shared/models";

@Component({
    selector: "app-payments",
    standalone: true,
    imports: [LucideAngularModule, ButtonComponent, DataTableComponent, TableCellDirective],
    templateUrl: "./payments.component.html",
})
export class PaymentsComponent {
    icons = {
        download: Download,
        card: CreditCard,
        phone: Smartphone,
        bank: Landmark,
        wallet: Wallet,
    };

    payments: Payment[] = [
        { id: "p1", paymentId: "PAY-8831", order: "ORD-2048", customer: "Sarah Johnson", amount: 189.5, method: "Credit Card", status: "Paid", date: "Aug 09, 2026 · 10:48" },
        { id: "p2", paymentId: "PAY-8830", order: "ORD-2047", customer: "James Miller", amount: 1240.0, method: "Bank Transfer", status: "Paid", date: "Aug 09, 2026 · 09:22" },
        { id: "p3", paymentId: "PAY-8829", order: "ORD-2046", customer: "Emily Davis", amount: 429.0, method: "Credit Card", status: "Pending", date: "Aug 09, 2026 · 08:09" },
        { id: "p4", paymentId: "PAY-8828", order: "ORD-2045", customer: "Michael Brown", amount: 342.75, method: "PayPal", status: "Paid", date: "Aug 08, 2026 · 16:40" },
        { id: "p5", paymentId: "PAY-8827", order: "ORD-2044", customer: "Olivia Wilson", amount: 97.8, method: "Credit Card", status: "Refunded", date: "Aug 08, 2026 · 14:35" },
        { id: "p6", paymentId: "PAY-8826", order: "ORD-2043", customer: "Daniel Taylor", amount: 685.4, method: "Bank Transfer", status: "Paid", date: "Aug 08, 2026 · 11:52" },
        { id: "p7", paymentId: "PAY-8825", order: "ORD-2042", customer: "Sophia Martinez", amount: 254.0, method: "Cash", status: "Pending", date: "Aug 07, 2026 · 17:20" },
        { id: "p8", paymentId: "PAY-8824", order: "ORD-2041", customer: "Ethan Anderson", amount: 78.5, method: "Mobile", status: "Paid", date: "Aug 07, 2026 · 10:02" },
        { id: "p9", paymentId: "PAY-8823", order: "ORD-2040", customer: "Ava Rodriguez", amount: 912.3, method: "Credit Card", status: "Failed", date: "Aug 06, 2026 · 13:30" },
        { id: "p10", paymentId: "PAY-8822", order: "ORD-2039", customer: "Liam Walker", amount: 39.99, method: "PayPal", status: "Paid", date: "Aug 06, 2026 · 10:21" },
    ];

    columns: TableColumn<Payment>[] = [
        { key: "paymentId", label: "Payment ID", bold: true, sortable: true },
        { key: "order", label: "Order", hide: "hidden md:table-cell" },
        { key: "customer", label: "Customer" },
        { key: "amount", label: "Amount", align: "right", sortable: true, render: (row) => this.currency(row.amount) },
        { key: "method", label: "Method", badge: (row) => this.methodBadge(row.method) },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
        { key: "date", label: "Date", hide: "hidden lg:table-cell" },
    ];

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    methodIcon(method: PaymentMethod): LucideIconData {
        if (method === "Credit Card") return this.icons.card;
        if (method === "Bank Transfer") return this.icons.bank;
        if (method === "Cash") return this.icons.wallet;
        return this.icons.phone;
    }

    methodBadge(method: PaymentMethod): { label: string; variant: BadgeVariant } {
        return { label: method, variant: "blue" };
    }

    statusBadge(status: PaymentStatus): { label: string; variant: BadgeVariant } {
        if (status === "Paid") return { label: "Paid", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        if (status === "Failed") return { label: "Failed", variant: "red" };
        return { label: "Refunded", variant: "violet" };
    }

    filterOptions = ["Paid", "Pending", "Failed", "Refunded"];

    filterByStatus(row: Payment, value: string): boolean {
        return row.status === value;
    }
}
