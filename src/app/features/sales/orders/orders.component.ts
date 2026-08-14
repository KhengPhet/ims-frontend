import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Plus,
    Download,
    ShoppingBag,
    CircleDollarSign,
    Users,
    Clock,
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
import { Order, OrderStatus } from "../../../shared/models";
import { OrdersService } from "./orders.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-orders",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent],
    templateUrl: "./orders.component.html",
})
export class OrdersComponent {
    private readonly router = inject(Router);
    private readonly service = inject(OrdersService);

    readonly orders = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        bag: ShoppingBag,
        dollar: CircleDollarSign,
        users: Users,
        clock: Clock,
        alert: TriangleAlert,
        trash: Trash2,
    };

    deleteTarget: Order | null = null;

    stats: StatCard[] = [
        { title: "Total Orders", value: "1,024", icon: ShoppingBag, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "all time" },
        { title: "Revenue", value: "$86,420", icon: CircleDollarSign, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "this month" },
        { title: "Pending Orders", value: "37", icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "need attention" },
        { title: "Active Customers", value: "486", icon: Users, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "ordering" },
    ];

    columns: TableColumn<Order>[] = [
        { key: "orderNumber", label: "Order ID", bold: true, sortable: true },
        { key: "customer", label: "Customer", hide: "hidden md:table-cell" },
        { key: "date", label: "Date", hide: "hidden lg:table-cell" },
        { key: "items", label: "Items", align: "right" },
        { key: "total", label: "Total", align: "right", sortable: true, render: (row) => this.currency(row.total) },
        { key: "payment", label: "Payment", hide: "hidden lg:table-cell", badge: (row) => this.paymentBadge(row.payment) },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    filterOptions = ["Completed", "Processing", "Pending", "Refunded", "Cancelled"];

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusBadge(status: OrderStatus): { label: string; variant: BadgeVariant } {
        if (status === "Completed") return { label: "Delivered", variant: "green" };
        if (status === "Processing") return { label: "Processing", variant: "blue" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        if (status === "Refunded") return { label: "Refunded", variant: "violet" };
        return { label: "Cancelled", variant: "red" };
    }

    paymentBadge(payment: string): { label: string; variant: BadgeVariant } {
        if (payment === "Paid") return { label: "Paid", variant: "green" };
        if (payment === "Pending") return { label: "Pending", variant: "amber" };
        return { label: "Refunded", variant: "violet" };
    }

    filterByStatus(row: Order, value: string): boolean {
        return row.status === value;
    }

    addOrder(): void {
        this.router.navigate(["/sales/orders/add"]);
    }

    editOrder(order: Order): void {
        this.router.navigate(["/sales/orders/edit", order.id]);
    }

    deleteOrder(order: Order): void {
        this.deleteTarget = order;
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
