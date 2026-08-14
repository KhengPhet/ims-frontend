import { Component } from "@angular/core";
import {
  LucideAngularModule,
  Download,
  CalendarDays,
  Boxes,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  TriangleAlert,
  RefreshCw,
  Warehouse,
  TrendingUp,
  CircleDollarSign,
  LucideIconData,
} from "lucide-angular";

interface StatCard {
  title: string;
  value: string;
  icon: LucideIconData;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
}

@Component({
  selector: "app-inventory-report",
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: "./inventory-report.component.html",
})
export class InventoryReportComponent {
  icons = {
    download: Download,
    calendar: CalendarDays,
    boxes: Boxes,
    package: Package,
    arrowDown: ArrowDownToLine,
    arrowUp: ArrowUpFromLine,
    alert: TriangleAlert,
    adjust: RefreshCw,
    warehouse: Warehouse,
    trendingUp: TrendingUp,
    dollar: CircleDollarSign,
  };

  stats: StatCard[] = [
    { title: "Total Stock Value", value: "$184,250", icon: CircleDollarSign, iconBg: "bg-blue-100", iconColor: "text-blue-600", trend: "+4.8%", trendUp: true },
    { title: "Units in Stock", value: "5,214", icon: Boxes, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", trend: "+2.1%", trendUp: true },
    { title: "Low Stock Items", value: "23", icon: TriangleAlert, iconBg: "bg-amber-100", iconColor: "text-amber-600", trend: "-3", trendUp: true },
    { title: "Out of Stock", value: "8", icon: Package, iconBg: "bg-red-100", iconColor: "text-red-600", trend: "+2", trendUp: false },
  ];

  categories = [
    { name: "Electronics", value: 12400, percent: 84, color: "bg-blue-500" },
    { name: "Food & Beverage", value: 15800, percent: 73, color: "bg-emerald-500" },
    { name: "Furniture", value: 2400, percent: 62, color: "bg-violet-500" },
    { name: "Apparel", value: 5200, percent: 58, color: "bg-amber-500" },
    { name: "Stationery", value: 8900, percent: 45, color: "bg-rose-500" },
    { name: "Tools", value: 6100, percent: 38, color: "bg-slate-500" },
  ];

  maxUnits = 16000;

  categoryBar(value: number): string {
    return `${Math.round((value / this.maxUnits) * 100)}%`;
  }

  movements = [
    { day: "Mon", in: 120, out: 90 },
    { day: "Tue", in: 160, out: 110 },
    { day: "Wed", in: 95, out: 140 },
    { day: "Thu", in: 180, out: 130 },
    { day: "Fri", in: 210, out: 170 },
    { day: "Sat", in: 80, out: 60 },
    { day: "Sun", in: 40, out: 35 },
  ];

  movementMax = 220;

  barHeight(value: number): string {
    return `${Math.max(6, Math.round((value / this.movementMax) * 100))}%`;
  }

  lowStock = [
    { name: "USB-C Cable 2m", sku: "PRD-2088", quantity: 12, reorderLevel: 40 },
    { name: "A4 Paper Ream", sku: "PRD-3351", quantity: 18, reorderLevel: 50 },
    { name: "HDMI Cable 1.5m", sku: "PRD-1187", quantity: 9, reorderLevel: 30 },
    { name: "Stainless Bottle 1L", sku: "PRD-4410", quantity: 22, reorderLevel: 35 },
  ];

  stockStatus(item: { quantity: number; reorderLevel: number }): { label: string; cls: string } {
    if (item.quantity <= item.reorderLevel * 0.5) {
      return { label: "Critical", cls: "bg-red-100 text-red-600" };
    }
    return { label: "Low", cls: "bg-amber-100 text-amber-600" };
  }
}
