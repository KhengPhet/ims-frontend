import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Package,
    CircleDollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
    TriangleAlert,
    ArrowDown,
    ArrowUp,
    Clock,
    CreditCard,
    Wallet,
    Download,
    Plus,
    Search,
    LucideIconData,
} from "lucide-angular";
import { StatCardComponent } from "../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { BadgeComponent } from "../../shared/components/badge/badge.component";
import { Product } from "../../shared/models";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    trend: string;
    trendUp: boolean;
    note: string;
}

interface TopProduct {
    name: string;
    sku: string;
    revenue: number;
    units: number;
    percent: number;
    bar: string;
}

interface ActivityItem {
    product: string;
    type: "Stock In" | "Stock Out" | "Sale" | "Adjustment";
    quantity: number;
    unit: string;
    date: string;
    status: "Completed" | "Pending" | "Failed";
}

@Component({
    selector: "app-dashboard",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, BadgeComponent],
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
    private readonly router = inject(Router);

    icons = {
        search: Search,
        download: Download,
        plus: Plus,
        arrowUp: ArrowUp,
        arrowDown: ArrowDown,
        clock: Clock,
        card: CreditCard,
        wallet: Wallet,
    };

    cards: StatCard[] = [
        { title: "Total Products", value: "1,248", icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600", trend: "+12%", trendUp: true, note: "vs last month" },
        { title: "Total Sales", value: "$84,250", icon: CircleDollarSign, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", trend: "+8.4%", trendUp: true, note: "vs last month" },
        { title: "Orders", value: "1,562", icon: ShoppingCart, iconBg: "bg-violet-100", iconColor: "text-violet-600", trend: "+5.2%", trendUp: true, note: "vs last month" },
        { title: "Customers", value: "486", icon: Users, iconBg: "bg-sky-100", iconColor: "text-sky-600", trend: "+22", trendUp: true, note: "new this month" },
        { title: "Revenue", value: "$184,250", icon: TrendingUp, iconBg: "bg-amber-100", iconColor: "text-amber-600", trend: "+3.1%", trendUp: true, note: "this quarter" },
        { title: "Low Stock", value: "23", icon: TriangleAlert, iconBg: "bg-red-100", iconColor: "text-red-600", trend: "-2", trendUp: false, note: "need reorder" },
    ];

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    sales = [32, 42, 38, 55, 48, 62, 58, 72, 66, 78, 84, 92];
    salesMax = 100;

    stockIn = [420, 520, 380, 640, 720, 580];
    stockOut = [300, 460, 420, 510, 680, 610];
    stockMax = 800;

    topProducts: TopProduct[] = [
        { name: "Wireless Mouse MX", sku: "PRD-1024", revenue: 12480, units: 312, percent: 86, bar: "bg-blue-500" },
        { name: "Bluetooth Speaker", sku: "PRD-8844", revenue: 9820, units: 205, percent: 68, bar: "bg-emerald-500" },
        { name: "Office Chair Ergo", sku: "PRD-5562", revenue: 8120, units: 54, percent: 56, bar: "bg-violet-500" },
        { name: "Desk Lamp LED", sku: "PRD-6630", revenue: 6840, units: 128, percent: 47, bar: "bg-amber-500" },
        { name: "Notebook A5 Grid", sku: "PRD-7718", revenue: 5210, units: 305, percent: 36, bar: "bg-sky-500" },
    ];

    lowStock: Product[] = [
        { id: "1", name: "Wireless Mouse MX", sku: "PRD-1024", category: "Electronics", brand: "Logitech", price: 39.99, quantity: 6, reorderLevel: 25, status: "Low Stock" },
        { id: "2", name: "USB-C Cable 2m", sku: "PRD-2088", category: "Electronics", brand: "Anker", price: 12.5, quantity: 12, reorderLevel: 40, status: "Low Stock" },
        { id: "3", name: "A4 Paper Ream", sku: "PRD-3351", category: "Stationery", brand: "Double A", price: 8.75, quantity: 18, reorderLevel: 50, status: "Low Stock" },
        { id: "4", name: "Stainless Bottle 1L", sku: "PRD-4410", category: "Kitchen", brand: "Hydro Flask", price: 32.0, quantity: 22, reorderLevel: 35, status: "Low Stock" },
        { id: "5", name: "HDMI Cable 1.5m", sku: "PRD-1187", category: "Electronics", brand: "UGREEN", price: 9.9, quantity: 9, reorderLevel: 30, status: "Low Stock" },
    ];

    activity: ActivityItem[] = [
        { product: "Wireless Mouse MX", type: "Stock Out", quantity: 24, unit: "pcs", date: "Today, 09:41", status: "Completed" },
        { product: "Office Chair Ergo", type: "Stock In", quantity: 50, unit: "pcs", date: "Today, 08:15", status: "Completed" },
        { product: "Logitech Keyboard K380", type: "Sale", quantity: 12, unit: "pcs", date: "Yesterday, 17:02", status: "Completed" },
        { product: "Laptop Stand Aluminum", type: "Adjustment", quantity: -3, unit: "pcs", date: "Yesterday, 14:30", status: "Pending" },
        { product: "Desk Lamp LED", type: "Stock In", quantity: 120, unit: "pcs", date: "Yesterday, 11:12", status: "Completed" },
    ];

    salesHeight(value: number): string {
        return `${Math.max(6, Math.round((value / this.salesMax) * 100))}%`;
    }

    barHeight(value: number): string {
        return `${Math.max(6, Math.round((value / this.stockMax) * 100))}%`;
    }

    currency(value: number): string {
        return "$" + value.toLocaleString();
    }

    activityIcon(type: ActivityItem["type"]) {
        if (type === "Stock In") return this.icons.arrowDown;
        if (type === "Stock Out") return this.icons.arrowUp;
        if (type === "Sale") return this.icons.wallet;
        return this.icons.clock;
    }

    lowStockBar(item: Product): number {
        return Math.min(100, Math.round((item.quantity / item.reorderLevel) * 100));
    }

    goToProducts(): void {
        this.router.navigate(["/products/add"]);
    }

    goToHistory(): void {
        this.router.navigate(["/inventory/history"]);
    }
}
