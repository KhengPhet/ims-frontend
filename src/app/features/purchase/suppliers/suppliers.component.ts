import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Plus,
    Download,
    Store,
    Truck,
    MapPin,
    ShieldCheck,
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
import { Supplier, SupplierStatus } from "../../../shared/models";
import { SuppliersService } from "./suppliers.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-suppliers",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent],
    templateUrl: "./suppliers.component.html",
})
export class SuppliersComponent {
    private readonly router = inject(Router);
    private readonly service = inject(SuppliersService);

    readonly suppliers = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        store: Store,
        truck: Truck,
        mapPin: MapPin,
        shield: ShieldCheck,
        dollar: CircleDollarSign,
        mail: Mail,
        phone: Phone,
        alert: TriangleAlert,
        trash: Trash2,
    };

    deleteTarget: Supplier | null = null;

    stats: StatCard[] = [
        { title: "Total Suppliers", value: "42", icon: Store, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "registered" },
        { title: "Active Suppliers", value: "36", icon: Truck, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "fulfilling orders" },
        { title: "Avg Lead Time", value: "9 days", icon: Truck, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "across suppliers" },
        { title: "Total Pending POs", value: "12", icon: CircleDollarSign, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "$92,340 value" },
    ];

    columns: TableColumn<Supplier>[] = [
        { key: "name", label: "Supplier", sortable: true, initials: (row) => this.initials(row.name) },
        { key: "contact", label: "Contact Person", hide: "hidden md:table-cell" },
        { key: "location", label: "Location", hide: "hidden lg:table-cell" },
        { key: "categories", label: "Categories", hide: "hidden xl:table-cell" },
        { key: "orders", label: "Orders", align: "right", sortable: true },
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

    statusBadge(status: SupplierStatus): { label: string; variant: BadgeVariant } {
        if (status === "Active") return { label: "Active", variant: "green" };
        return { label: "Inactive", variant: "gray" };
    }

    addSupplier(): void {
        this.router.navigate(["/purchase/suppliers/add"]);
    }

    viewSupplier(supplier: Supplier): void {
        this.router.navigate(["/purchase/suppliers/view", supplier.id]);
    }

    editSupplier(supplier: Supplier): void {
        this.router.navigate(["/purchase/suppliers/edit", supplier.id]);
    }

    deleteSupplier(supplier: Supplier): void {
        this.deleteTarget = supplier;
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
