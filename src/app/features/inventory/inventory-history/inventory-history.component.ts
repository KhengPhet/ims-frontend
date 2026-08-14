import { Component, inject } from "@angular/core";
import {
    LucideAngularModule,
    Download,
    History,
    ArrowDownToLine,
    ArrowUpFromLine,
    RefreshCw,
    LucideIconData,
} from "lucide-angular";
import { Router } from "@angular/router";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { StockTransaction, TransactionStatus } from "../../../shared/models";
import { InventoryHistoryService } from "./inventory-history.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-inventory-history",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective],
    templateUrl: "./inventory-history.component.html",
})
export class InventoryHistoryComponent {
    private readonly router = inject(Router);
    private readonly service = inject(InventoryHistoryService);

    readonly movements = this.service.items;

    icons = {
        download: Download,
        history: History,
        arrowDown: ArrowDownToLine,
        arrowUp: ArrowUpFromLine,
        adjust: RefreshCw,
    };

    stats: StatCard[] = [
        { title: "Movements (30d)", value: "1,842", icon: History, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "total transactions" },
        { title: "Stock In", value: "986", icon: ArrowDownToLine, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "received" },
        { title: "Stock Out", value: "724", icon: ArrowUpFromLine, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "dispatched" },
        { title: "Adjustments", value: "132", icon: RefreshCw, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "corrected" },
    ];

    columns: TableColumn<StockTransaction>[] = [
        { key: "date", label: "Date", sortable: true, bold: true },
        { key: "type", label: "Transaction Type", badge: (row) => this.typeBadge(row.type) },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Quantity", align: "right", render: (row) => this.quantityText(row) },
        { key: "user", label: "User", hide: "hidden lg:table-cell" },
        { key: "reference", label: "Reference", hide: "hidden md:table-cell" },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    filterOptions = ["Stock In", "Stock Out", "Adjustment"];

    quantityText(row: StockTransaction): string {
        const sign = row.quantity < 0 ? "" : "+";
        return `${sign}${row.quantity.toLocaleString()}`;
    }

    typeBadge(type: StockTransaction["type"]): { label: string; variant: BadgeVariant } {
        if (type === "Stock In") return { label: "Stock In", variant: "green" };
        if (type === "Stock Out") return { label: "Stock Out", variant: "amber" };
        return { label: "Adjustment", variant: "violet" };
    }

    statusBadge(status: TransactionStatus): { label: string; variant: BadgeVariant } {
        if (status === "Completed") return { label: "Completed", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        return { label: "Cancelled", variant: "red" };
    }

    filterByType(row: StockTransaction, value: string): boolean {
        return row.type === value;
    }

    editMovement(movement: StockTransaction): void {
        this.router.navigate(["/inventory/history/edit", movement.id]);
    }
}
