import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    ClipboardList,
    Package,
    SquarePen,
    Store,
    Tag,
    Truck,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { PurchaseOrder, PurchaseOrderStatus } from "../../../../shared/models";
import { PurchaseOrdersService } from "../purchase-orders.service";

@Component({
    selector: "app-view-purchase-order",
    standalone: true,
    imports: [RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./view-purchase-order.component.html",
})
export class ViewPurchaseOrderComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(PurchaseOrdersService);

    record: PurchaseOrder | null = null;

    icons = {
        back: ArrowLeft,
        chevronRight: ChevronRight,
        list: ClipboardList,
        store: Store,
        package: Package,
        calendar: CalendarDays,
        tag: Tag,
        truck: Truck,
        edit: SquarePen,
    };

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        this.record = id ? (this.service.getById(id) ?? null) : null;
        if (!this.record) {
            this.router.navigate(["/purchase/orders"]);
        }
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    statusClass(status: PurchaseOrderStatus): { wrapper: string; dot: string; label: string } {
        const map: Record<PurchaseOrderStatus, { wrapper: string; dot: string; label: string }> = {
            Received: { wrapper: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", label: "Received" },
            Approved: { wrapper: "bg-blue-50 text-blue-600", dot: "bg-blue-500", label: "Approved" },
            "In Transit": { wrapper: "bg-violet-50 text-violet-600", dot: "bg-violet-500", label: "In Transit" },
            Cancelled: { wrapper: "bg-red-50 text-red-600", dot: "bg-red-500", label: "Cancelled" },
            Pending: { wrapper: "bg-amber-50 text-amber-600", dot: "bg-amber-500", label: "Pending" },
        };
        return map[status];
    }

    goBack(): void {
        this.router.navigate(["/purchase/orders"]);
    }

    goEdit(): void {
        if (this.record) {
            this.router.navigate(["/purchase/orders/edit", this.record.id]);
        }
    }
}
