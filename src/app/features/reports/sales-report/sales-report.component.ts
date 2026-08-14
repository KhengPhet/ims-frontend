import { Component } from "@angular/core";
import {
  LucideAngularModule,
  Download,
  ListFilter,
  CalendarDays,
  ShoppingBag,
  CircleDollarSign,
  Receipt,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUp,
  ArrowDown,
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
  selector: "app-sales-report",
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: "./sales-report.component.html",
})
export class SalesReportComponent {
  icons = {
    download: Download,
    filter: ListFilter,
    calendar: CalendarDays,
    bag: ShoppingBag,
    dollar: CircleDollarSign,
    receipt: Receipt,
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    eye: Eye,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
  };

  stats: StatCard[] = [
    { title: "Total Revenue", value: "$86,420", icon: CircleDollarSign, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", trend: "+12.4%", trendUp: true },
    { title: "Total Orders", value: "1,024", icon: ShoppingBag, iconBg: "bg-blue-100", iconColor: "text-blue-600", trend: "+8.2%", trendUp: true },
    { title: "Avg. Order Value", value: "$84.50", icon: Receipt, iconBg: "bg-violet-100", iconColor: "text-violet-600", trend: "+3.9%", trendUp: true },
    { title: "Refunds", value: "$980", icon: TrendingDown, iconBg: "bg-red-100", iconColor: "text-red-600", trend: "-2.1%", trendUp: false },
  ];

  filters = ["Weekly", "Monthly", "Quarterly", "Yearly"];
  activeFilter = "Monthly";

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  revenue = [4200, 5100, 4800, 6200, 5800, 7400, 6900, 8600];
  orders = [320, 410, 380, 520, 490, 610, 560, 720];

  chartMax = 9000;

  barHeight(value: number): string {
    return `${Math.max(6, Math.round((value / this.chartMax) * 100))}%`;
  }

  topProducts = [
    { name: "Wireless Mouse MX", sku: "PRD-1024", units: 342, revenue: 13676.58, percent: 92, color: "bg-blue-500" },
    { name: "Bluetooth Speaker", sku: "PRD-8844", units: 287, revenue: 25543.0, percent: 78, color: "bg-emerald-500" },
    { name: "Office Chair Ergo", sku: "PRD-5562", units: 156, revenue: 66924.0, percent: 64, color: "bg-violet-500" },
    { name: "Notebook A5 Grid", sku: "PRD-7718", units: 1180, revenue: 19942.0, percent: 51, color: "bg-amber-500" },
    { name: "Desk Lamp LED", sku: "PRD-6630", units: 224, revenue: 12152.0, percent: 43, color: "bg-rose-500" },
  ];

  maxRevenue = 67000;

  productBar(value: number): string {
    return `${Math.round((value / this.maxRevenue) * 100)}%`;
  }

  currency(value: number): string {
    return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }
}
