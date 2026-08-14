import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Plus,
    Download,
    ClipboardList,
    Clock,
    Truck,
    CircleDollarSign,
    PackageCheck,
    XCircle,
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
import { PurchaseOrder, PurchaseOrderStatus } from "../../../shared/models";
import { PurchaseOrdersService } from "./purchase-orders.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-purchase-orders",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent],
    templateUrl: "./purchase-orders.component.html",
})
export class PurchaseOrdersComponent {
    private readonly router = inject(Router);
    private readonly service = inject(PurchaseOrdersService);

    readonly purchaseOrders = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        list: ClipboardList,
        clock: Clock,
        truck: Truck,
        dollar: CircleDollarSign,
        check: PackageCheck,
        x: XCircle,
        alert: TriangleAlert,
        trash: Trash2,
    };

    deleteTarget: PurchaseOrder | null = null;

    stats: StatCard[] = [
        { title: "Total Purchase Orders", value: "318", icon: ClipboardList, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "all time" },
        { title: "Pending Approval", value: "12", icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "awaiting review" },
        { title: "In Transit", value: "8", icon: Truck, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "on the way" },
        { title: "Total PO Value", value: "$92,340", icon: CircleDollarSign, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "this month" },
    ];

    columns: TableColumn<PurchaseOrder>[] = [
        { key: "poNumber", label: "PO Number", bold: true, sortable: true },
        { key: "supplier", label: "Supplier", hide: "hidden md:table-cell" },
        { key: "items", label: "Items", align: "right" },
        { key: "total", label: "Total", align: "right", sortable: true, render: (row) => this.currency(row.total) },
        { key: "orderDate", label: "Order Date", hide: "hidden lg:table-cell" },
        { key: "expectedDate", label: "Expected", hide: "hidden xl:table-cell" },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    filterOptions = ["Pending", "Approved", "In Transit", "Received", "Cancelled"];

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusBadge(status: PurchaseOrderStatus): { label: string; variant: BadgeVariant } {
        if (status === "Received") return { label: "Received", variant: "green" };
        if (status === "Approved") return { label: "Approved", variant: "blue" };
        if (status === "In Transit") return { label: "In Transit", variant: "violet" };
        if (status === "Cancelled") return { label: "Cancelled", variant: "red" };
        return { label: "Pending", variant: "amber" };
    }

    filterByStatus(row: PurchaseOrder, value: string): boolean {
        return row.status === value;
    }

    createPO(): void {
        this.router.navigate(["/purchase/orders/add"]);
    }

    viewPO(order: PurchaseOrder): void {
        this.router.navigate(["/purchase/orders/view", order.id]);
    }

    editPO(order: PurchaseOrder): void {
        this.router.navigate(["/purchase/orders/edit", order.id]);
    }

    deletePO(order: PurchaseOrder): void {
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
