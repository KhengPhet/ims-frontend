import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LucideAngularModule, Plus, Download, Eye, Printer, Send, CircleCheck, TriangleAlert, Clock, LucideIconData } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { Invoice, InvoiceStatus } from "../../../shared/models";

@Component({
    selector: "app-invoice",
    standalone: true,
    imports: [LucideAngularModule, ButtonComponent, DataTableComponent, TableCellDirective],
    templateUrl: "./invoice.component.html",
})
export class InvoiceComponent {
    private readonly router = inject(Router);

    icons = {
        plus: Plus,
        download: Download,
        printer: Printer,
        send: Send,
        check: CircleCheck,
        alert: TriangleAlert,
        clock: Clock,
    };

    invoices: Invoice[] = [
        { id: "i1", invoiceNumber: "INV-2026-0512", customer: "Sarah Johnson", issueDate: "Aug 09, 2026", dueDate: "Sep 08, 2026", amount: 189.5, status: "Pending" },
        { id: "i2", invoiceNumber: "INV-2026-0511", customer: "James Miller", issueDate: "Aug 09, 2026", dueDate: "Sep 08, 2026", amount: 1240.0, status: "Paid" },
        { id: "i3", invoiceNumber: "INV-2026-0510", customer: "Emily Davis", issueDate: "Aug 08, 2026", dueDate: "Sep 07, 2026", amount: 429.0, status: "Pending" },
        { id: "i4", invoiceNumber: "INV-2026-0509", customer: "Michael Brown", issueDate: "Aug 08, 2026", dueDate: "Sep 07, 2026", amount: 342.75, status: "Paid" },
        { id: "i5", invoiceNumber: "INV-2026-0508", customer: "Olivia Wilson", issueDate: "Jul 20, 2026", dueDate: "Aug 19, 2026", amount: 97.8, status: "Overdue" },
        { id: "i6", invoiceNumber: "INV-2026-0507", customer: "Daniel Taylor", issueDate: "Aug 07, 2026", dueDate: "Sep 06, 2026", amount: 685.4, status: "Paid" },
        { id: "i7", invoiceNumber: "INV-2026-0506", customer: "Sophia Martinez", issueDate: "Aug 06, 2026", dueDate: "Sep 05, 2026", amount: 254.0, status: "Pending" },
        { id: "i8", invoiceNumber: "INV-2026-0505", customer: "Ethan Anderson", issueDate: "Aug 05, 2026", dueDate: "Sep 04, 2026", amount: 78.5, status: "Paid" },
        { id: "i9", invoiceNumber: "INV-2026-0504", customer: "Ava Rodriguez", issueDate: "Aug 04, 2026", dueDate: "Sep 03, 2026", amount: 912.3, status: "Draft" },
        { id: "i10", invoiceNumber: "INV-2026-0503", customer: "Liam Walker", issueDate: "Jul 15, 2026", dueDate: "Aug 14, 2026", amount: 39.99, status: "Overdue" },
    ];

    columns: TableColumn<Invoice>[] = [
        { key: "invoiceNumber", label: "Invoice Number", bold: true, sortable: true },
        { key: "customer", label: "Customer", hide: "hidden md:table-cell" },
        { key: "issueDate", label: "Issue Date", hide: "hidden lg:table-cell" },
        { key: "dueDate", label: "Due Date", hide: "hidden lg:table-cell" },
        { key: "amount", label: "Amount", align: "right", sortable: true, render: (row) => this.currency(row.amount) },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    filterOptions = ["Paid", "Pending", "Overdue", "Draft"];

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusBadge(status: InvoiceStatus): { label: string; variant: BadgeVariant } {
        if (status === "Paid") return { label: "Paid", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        if (status === "Overdue") return { label: "Overdue", variant: "red" };
        return { label: "Draft", variant: "gray" };
    }

    filterByStatus(row: Invoice, value: string): boolean {
        return row.status === value;
    }

    newInvoice(): void {
        this.router.navigate(["/sales/invoice/add"]);
    }
}
