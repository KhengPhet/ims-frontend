import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ArrowLeft,
    Building2,
    ChevronRight,
    CircleDollarSign,
    ClipboardList,
    Mail,
    MapPin,
    ShoppingBag,
    SquarePen,
    Store,
    Tag,
    UserRound,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Supplier } from "../../../../shared/models";
import { SuppliersService } from "../suppliers.service";

@Component({
    selector: "app-view-supplier",
    standalone: true,
    imports: [RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./view-supplier.component.html",
})
export class ViewSupplierComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(SuppliersService);

    record: Supplier | null = null;

    icons = {
        back: ArrowLeft,
        chevronRight: ChevronRight,
        store: Store,
        building: Building2,
        contact: UserRound,
        mail: Mail,
        mapPin: MapPin,
        categories: Tag,
        orders: ShoppingBag,
        dollar: CircleDollarSign,
        edit: SquarePen,
        list: ClipboardList,
    };

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        this.record = id ? (this.service.getById(id) ?? null) : null;
        if (!this.record) {
            this.router.navigate(["/purchase/suppliers"]);
        }
    }

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    currency(value: number): string {
        return "$" + (value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    goBack(): void {
        this.router.navigate(["/purchase/suppliers"]);
    }

    goEdit(): void {
        if (this.record) {
            this.router.navigate(["/purchase/suppliers/edit", this.record.id]);
        }
    }
}
