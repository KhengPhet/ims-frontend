import { Component, inject } from "@angular/core";
import {
    LucideAngularModule,
    Plus,
    Download,
    ArrowUpFromLine,
    ShoppingCart,
    Send,
    Clock,
    LucideIconData,
} from "lucide-angular";
import { Router } from "@angular/router";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { StockOutRecord, TransactionStatus } from "../../../shared/models";
import { StockOutService } from "./stock-out.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-stock-out",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective],
    templateUrl: "./stock-out.component.html",
})
export class StockOutComponent {
    private readonly router = inject(Router);
    private readonly service = inject(StockOutService);

    readonly records = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        arrowUp: ArrowUpFromLine,
        cart: ShoppingCart,
        send: Send,
        clock: Clock,
    };

    stats: StatCard[] = [
        { title: "Issued Today", value: "18", icon: ArrowUpFromLine, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "dispatched today" },
        { title: "Units Issued", value: "2,640", icon: Send, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "this week" },
        { title: "Pending Orders", value: "9", icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "awaiting dispatch" },
        { title: "Issued to Sales", value: "$21,840", icon: ShoppingCart, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "this week" },
    ];

    columns: TableColumn<StockOutRecord>[] = [
        { key: "reference", label: "Reference", bold: true, sortable: true },
        { key: "product", label: "Product", hide: "hidden md:table-cell" },
        { key: "destination", label: "Destination" },
        { key: "quantity", label: "Quantity", align: "right" },
        { key: "date", label: "Date", hide: "hidden lg:table-cell" },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    statusBadge(status: TransactionStatus): { label: string; variant: BadgeVariant } {
        if (status === "Completed") return { label: "Completed", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        return { label: "Cancelled", variant: "red" };
    }

    addStockOut(): void {
        this.router.navigate(["/inventory/stock-out/add"]);
    }

    editStockOut(record: StockOutRecord): void {
        this.router.navigate(["/inventory/stock-out/edit", record.id]);
    }
}
