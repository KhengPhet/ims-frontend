import { Component } from "@angular/core";
import {
  LucideAngularModule,
  Download,
  CalendarDays,
  Banknote,
  CircleDollarSign,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Percent,
  Wallet,
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
  selector: "app-profit-report",
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: "./profit-report.component.html",
})
export class ProfitReportComponent {
  icons = {
    download: Download,
    calendar: CalendarDays,
    banknote: Banknote,
    dollar: CircleDollarSign,
    piggy: PiggyBank,
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    percent: Percent,
    wallet: Wallet,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
  };

  stats: StatCard[] = [
    { title: "Gross Profit", value: "$32,850", icon: Banknote, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", trend: "+14.2%", trendUp: true },
    { title: "Net Revenue", value: "$86,420", icon: CircleDollarSign, iconBg: "bg-blue-100", iconColor: "text-blue-600", trend: "+12.4%", trendUp: true },
    { title: "Cost of Goods", value: "$53,570", icon: PiggyBank, iconBg: "bg-amber-100", iconColor: "text-amber-600", trend: "+10.8%", trendUp: true },
    { title: "Profit Margin", value: "38.0%", icon: Percent, iconBg: "bg-violet-100", iconColor: "text-violet-600", trend: "+1.2%", trendUp: true },
  ];

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  revenue = [4200, 5100, 4800, 6200, 5800, 7400, 6900, 8642];
  cost = [2950, 3600, 3350, 4100, 3900, 4750, 4450, 5357];

  chartMax = 9000;

  barHeight(value: number): string {
    return `${Math.max(6, Math.round((value / this.chartMax) * 100))}%`;
  }

  monthsLabel = this.months;

  monthlyProfit(i: number): number {
    return this.revenue[i] - this.cost[i];
  }

  summary = [
    { label: "Gross Profit Margin", value: "38.0%", delta: "+1.2%", up: true },
    { label: "Operating Expenses", value: "$18,240", delta: "+4.5%", up: false },
    { label: "Net Profit", value: "$14,610", delta: "+9.8%", up: true },
    { label: "Avg. Order Profit", value: "$32.10", delta: "+6.4%", up: true },
  ];

  currency(value: number): string {
    return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
