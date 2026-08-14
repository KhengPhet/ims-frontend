import { Component, inject } from "@angular/core";
import {
    LucideAngularModule,
    Plus,
    Download,
    ArrowDownToLine,
    Truck,
    Boxes,
    CircleDollarSign,
    LucideIconData,
} from "lucide-angular";
import { Router } from "@angular/router";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { StockInRecord, TransactionStatus } from "../../../shared/models";
import { StockInService } from "./stock-in.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-stock-in",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective],
    templateUrl: "./stock-in.component.html",
})
export class StockInComponent {
    private readonly router = inject(Router);
    private readonly service = inject(StockInService);

    readonly records = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        arrowDown: ArrowDownToLine,
        truck: Truck,
        boxes: Boxes,
        dollar: CircleDollarSign,
    };

    stats: StatCard[] = [
        { title: "Receipts Today", value: "14", icon: ArrowDownToLine, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "processed today" },
        { title: "Units Received", value: "3,420", icon: Boxes, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "this week" },
        { title: "Active Suppliers", value: "28", icon: Truck, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "fulfilling orders" },
        { title: "Value Received", value: "$28,450", icon: CircleDollarSign, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "this week" },
    ];

    columns: TableColumn<StockInRecord>[] = [
        { key: "reference", label: "Reference", bold: true, sortable: true },
        { key: "product", label: "Product", hide: "hidden md:table-cell" },
        { key: "supplier", label: "Supplier", hide: "hidden lg:table-cell" },
        { key: "quantity", label: "Quantity", align: "right" },
        { key: "total", label: "Total Cost", align: "right", sortable: true, render: (row) => this.currency(row.total) },
        { key: "date", label: "Date", hide: "hidden lg:table-cell" },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    currency(value: number): string {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusBadge(status: TransactionStatus): { label: string; variant: BadgeVariant } {
        if (status === "Completed") return { label: "Completed", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        return { label: "Cancelled", variant: "red" };
    }

    addStockIn(): void {
        this.router.navigate(["/inventory/stock-in/add"]);
    }

    editStockIn(record: StockInRecord): void {
        this.router.navigate(["/inventory/stock-in/edit", record.id]);
    }
}
