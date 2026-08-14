import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Plus,
    Download,
    Users,
    UserPlus,
    Repeat,
    CircleDollarSign,
    Mail,
    Phone,
    TriangleAlert,
    Trash2,
    LucideIconData,
} from "lucide-angular";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { Customer, CustomerStatus } from "../../../shared/models";
import { CustomersService } from "./customers.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-customers",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent],
    templateUrl: "./customers.component.html",
})
export class CustomersComponent {
    private readonly router = inject(Router);
    private readonly service = inject(CustomersService);

    readonly customers = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        users: Users,
        userPlus: UserPlus,
        repeat: Repeat,
        dollar: CircleDollarSign,
        mail: Mail,
        phone: Phone,
        alert: TriangleAlert,
        trash: Trash2,
    };

    deleteTarget: Customer | null = null;

    stats: StatCard[] = [
        { title: "Total Customers", value: "486", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "registered" },
        { title: "New Customers", value: "42", icon: UserPlus, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "this month" },
        { title: "Repeat Customers", value: "318", icon: Repeat, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "65% retention" },
        { title: "Avg Order Value", value: "$84.20", icon: CircleDollarSign, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "per order" },
    ];

    columns: TableColumn<Customer>[] = [
        { key: "name", label: "Customer", sortable: true, initials: (row) => this.initials(row.name) },
        { key: "email", label: "Email", hide: "hidden lg:table-cell" },
        { key: "phone", label: "Phone", hide: "hidden xl:table-cell" },
        { key: "orders", label: "Orders", align: "right", sortable: true },
        { key: "totalSpent", label: "Total Spent", align: "right", sortable: true, render: (row) => this.currency(row.totalSpent) },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusBadge(status: CustomerStatus): { label: string; variant: BadgeVariant } {
        if (status === "Active") return { label: "Active", variant: "green" };
        if (status === "New") return { label: "New", variant: "blue" };
        return { label: "Inactive", variant: "gray" };
    }

    addCustomer(): void {
        this.router.navigate(["/sales/customers/add"]);
    }

    editCustomer(customer: Customer): void {
        this.router.navigate(["/sales/customers/edit", customer.id]);
    }

    deleteCustomer(customer: Customer): void {
        this.deleteTarget = customer;
    }

    confirmDelete(): void {
        if (this.deleteTarget) {
            this.service.delete(this.deleteTarget.id);
            this.deleteTarget = null;
        }
    }

    closeDelete(): void {
        this.deleteTarget = null;
    }
}
